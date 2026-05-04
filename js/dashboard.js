// ========================
// ELEMENTS HTML
// ========================
const historyEl = document.getElementById("history");
const detailsEl = document.getElementById("details");
const overlayEl = document.getElementById("overlay");
const backBtn = document.getElementById("backBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
const closeDetailsBtn = document.getElementById("closeDetailsBtn");

const driverEl = document.getElementById("driver");
const distanceEl = document.getElementById("distance");
const durationEl = document.getElementById("duration");
const startTimeEl = document.getElementById("startTime");
const endTimeEl = document.getElementById("endTime");
const remarkEl = document.getElementById("remarkText");

let detailMap = null;
let modalKeyHandler = null;
let modalFocusCleanup = null;

// Expose detailMap globally for PDF export
window.detailMap = null;

// ==== Éléments gestion voitures ====
const carsListEl = document.getElementById('carsList');
const carForm = document.getElementById('carForm');
const carNameEl = document.getElementById('carName');
const carDescEl = document.getElementById('carDesc');
const carImageUrlEl = document.getElementById('carImageUrl');
const carImageFileEl = document.getElementById('carImageFile');
const addCarBtn = document.getElementById('addCarBtn');
const carSelect = document.getElementById('carSelect');
const carTotalKmEl = document.getElementById('carTotalKm');

/** Helpers pour les voitures */
function _readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
        fr.readAsDataURL(file);
    });
}

async function addCarFromForm() {
    const name = carNameEl.value.trim();
    if (!name) return showToast('Veuillez saisir un nom de véhicule', {type:'warning'});

    let image = null;
    if (carImageFileEl && carImageFileEl.files && carImageFileEl.files[0]) {
        try { image = await _readFileAsDataURL(carImageFileEl.files[0]); } catch(e) { console.warn('Lecture image échouée', e); }
    } else if (carImageUrlEl && carImageUrlEl.value.trim()) {
        image = carImageUrlEl.value.trim();
    }

    const car = { name, description: carDescEl.value.trim(), image };
    const saved = saveCar(car);
    showToast('Véhicule ajouté', {type:'success'});

    // reset form
    clearCarForm();
    
    // refresh lists
    loadCars();

    // mettre en évidence le véhicule ajouté pour faciliter l'accessibilité
    if (saved && saved.id) {
        setTimeout(() => {
            const el = carsListEl.querySelector(`[data-id="${saved.id}"]`);
            if (el) {
                el.classList.add('car-just-added');
                el.setAttribute('tabindex', '0');
                el.focus();
                setTimeout(() => el.classList.remove('car-just-added'), 1600);
            }
        }, 100);
    }
}

function renderCarCard(car) {
    const div = document.createElement('div');
    div.className = 'car-card';
    div.setAttribute('data-id', car.id || '');
    div.setAttribute('role', 'listitem');
    div.setAttribute('aria-label', `${car.name}${car.description ? ' — ' + car.description : ''}`);
    div.setAttribute('tabindex', '0');

    const img = document.createElement('img');
    img.src = car.image || 'https://via.placeholder.com/400x200?text=Voiture';
    img.alt = car.name;

    const h = document.createElement('div');
    h.innerHTML = `<strong>${car.name}</strong>`;

    const meta = document.createElement('div');
    meta.className = 'meta';
    meta.textContent = car.description || '';

    const actions = document.createElement('div');
    actions.className = 'car-actions';

    const sel = document.createElement('button');
    sel.className = 'btn btn-ghost';
    sel.textContent = 'Sélectionner';
    sel.onclick = () => { if (carSelect) { carSelect.value = car.id; updateCarSummary(); loadHistory(); showToast('Véhicule sélectionné', {type:'info'}); } };

    const del = document.createElement('button');
    del.className = 'btn btn-ghost';
    del.textContent = 'Supprimer';
    del.onclick = (e) => { e.stopPropagation(); confirmToast('Supprimer ce véhicule ?').then(ok => { if (!ok) return; deleteCar(car.id); loadCars(); showToast('Véhicule supprimé', {type:'success'}); }); };

    actions.appendChild(sel);
    actions.appendChild(del);

    div.appendChild(img);
    div.appendChild(h);
    div.appendChild(meta);
    div.appendChild(actions);
    
    div.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sel.click(); }
    });
    
    return div;
}

function populateCarSelects() {
    const cars = getCars();
    // carSelect (dashboard)
    if (carSelect) {
        carSelect.innerHTML = '<option value="">-- Tous les véhicules --</option>';
        cars.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id; opt.textContent = c.name; carSelect.appendChild(opt);
        });
    }
    // carSelectForSave (index page) — si présent dans le DOM
    const saveSelect = document.getElementById('carSelectForSave');
    if (saveSelect) {
        saveSelect.innerHTML = '<option value="">-- Aucun --</option>';
        cars.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c.id; opt.textContent = c.name; saveSelect.appendChild(opt);
        });
    }

    // restore last used car for relevant selects
    try {
        const last = localStorage.getItem('lastCarId');
        if (last) {
            if (saveSelect) saveSelect.value = last;
            if (carSelect) carSelect.value = last;
        }
    } catch(e) {}
}

function updateCarSummary() {
    const carId = carSelect ? carSelect.value : '';
    let total = 0;
    getHistory().forEach(t => {
        if (!carId) { total += Number(t.distance) || 0; }
        else if (t.carId === carId) { total += Number(t.distance) || 0; }
    });
    if (carTotalKmEl) carTotalKmEl.textContent = total.toFixed(2);
}

addCarBtn && (addCarBtn.onclick = addCarFromForm);
(carSelect && carSelect.addEventListener) && carSelect.addEventListener('change', () => { updateCarSummary(); loadHistory(); });

// ----------------
// INITIALISATION UI VEHICULE (au chargement)
// ----------------
const chooseFileBtn = document.getElementById('chooseFileBtn');
const cancelCarBtn = document.getElementById('cancelCarBtn');

function clearCarForm() {
    if (carNameEl) carNameEl.value = '';
    if (carDescEl) carDescEl.value = '';
    if (carImageUrlEl) carImageUrlEl.value = '';
    if (carImageFileEl) carImageFileEl.value = '';
    const p = document.getElementById('carPreviewImg');
    if (p) p.src = 'https://via.placeholder.com/400x200?text=Voiture';
    if (cancelCarBtn) cancelCarBtn.classList.add('hidden');
}

// click bouton choisir -> ouvrir input file
if (chooseFileBtn && carImageFileEl) chooseFileBtn.addEventListener('click', () => carImageFileEl.click());
// quand on choisi un fichier, afficher preview
if (carImageFileEl) carImageFileEl.addEventListener('change', async () => {
    const p = document.getElementById('carPreviewImg');
    if (carImageFileEl.files && carImageFileEl.files[0] && p) {
        try { p.src = await _readFileAsDataURL(carImageFileEl.files[0]); } catch(e) { console.warn('Lecture image échouée', e); }
    }
});
// quand on colle une URL, mettre à jour l'aperçu
if (carImageUrlEl) carImageUrlEl.addEventListener('input', (e) => { const v = e.target.value.trim(); const p = document.getElementById('carPreviewImg'); if (v && p) p.src = v; });
// annuler
if (cancelCarBtn) cancelCarBtn.addEventListener('click', clearCarForm);

// Exporer clearCarForm pour usage externe si nécessaire
window.clearCarForm = clearCarForm;


// ========================
// CHARGER L'HISTORIQUE
// ========================
function loadHistory() {
    // Lire l'intégralité des trajets et corriger/migrer si nécessaire
    const allTrips = JSON.parse(localStorage.getItem("trips") || "[]");

    // Ensure every trip in the full dataset has an `id` for delete/undo compatibility
    let updated = false;
    allTrips.forEach(t => {
        if (!t.id) { t.id = Date.now().toString(36) + Math.random().toString(36).slice(2,6); updated = true; }
    });
    if (updated && typeof replaceTrips === 'function') {
        replaceTrips(allTrips);
        console.log('IDs assignés aux trajets hérités pour compatibilité de suppression');
    }

    // Ensuite construire la vue filtrée selon le véhicule sélectionné
    let trips = allTrips.slice();
    const selectedCar = (carSelect && carSelect.value) ? carSelect.value : '';
    if (selectedCar) {
        trips = trips.filter(t => t.carId === selectedCar);
    }

    historyEl.innerHTML = "";

    if (trips.length === 0) {
        const li = document.createElement("li");
        li.textContent = "Aucun trajet enregistré";
        li.style.cursor = "default";
        li.classList.add('card','history-empty');
        li.setAttribute('aria-live','polite');
        historyEl.appendChild(li);
        return;
    }

    trips.forEach(trip => {
        const li = document.createElement("li");
        // contenu principal de l'élément d'historique
        const content = document.createElement('div');
        content.className = 'history-content';
        // afficher véhicule si associé
        const car = trip.carId ? getCarById(trip.carId) : null;
        let contentText = `${trip.startCity} → ${trip.endCity} (${Number(trip.distance).toFixed(2)} km)`;
        if (car) contentText += ` — ${car.name}`;
        if (Number(trip.toll) && Number(trip.toll) > 0) contentText += ` — Péages : ${Number(trip.toll).toFixed(2)} €`;
        content.textContent = contentText;

        // bouton supprimer
        const delBtn = document.createElement('button');
        delBtn.className = 'btn btn-ghost delete-btn';
        delBtn.title = 'Supprimer';
        delBtn.innerHTML = '🗑';
        delBtn.onclick = (e) => { e.stopPropagation(); handleDeleteTrip(trip.id); };

        // assemble
        li.classList.add('card', 'history-item');
        li.setAttribute('tabindex', '0');
        li.appendChild(content);
        li.appendChild(delBtn);

        li.onclick = () => openDetails(trip);
        li.addEventListener('keypress', (e) => { if (e.key === 'Enter' || e.key === ' ') openDetails(trip); });
        historyEl.appendChild(li);
    });
}

// ========================
// OUVRIR DETAILS (POPUP)
// ========================
function openDetails(trip) {
    detailsEl.classList.remove("hidden");
    overlayEl.classList.remove("hidden");
    // empêcher le défilement de fond pendant que la modale est ouverte
    document.body.classList.add('no-scroll');
    
    // Store trip data for PDF export
    if (typeof setTripForPDF === 'function') {
        setTripForPDF(trip);
    }

    driverEl.textContent = `${trip.firstname || ""} ${trip.lastname || ""}`.trim() || "—";
    // Véhicule
    const vehicleNameEl = document.getElementById('vehicleName');
    const vehicleImageEl = document.getElementById('vehicleImage');
    const car = trip.carId ? getCarById(trip.carId) : null;
    vehicleNameEl.textContent = car ? car.name : '—';
    vehicleImageEl.innerHTML = car && car.image ? `<img src="${car.image}" alt="${car.name}" style="max-width:100%;height:120px;object-fit:cover;border-radius:var(--radius-sm)">` : '';

    // péages
    const tollsEl = document.getElementById('tolls');
    const editBtn = document.getElementById('editTollsBtn');
    tollsEl.textContent = (Number(trip.toll) || 0).toFixed(2);

    // handler édition péage inline
    editBtn.onclick = () => {
        if (tollsEl.dataset.editing) return; // éviter re-entrées
        tollsEl.dataset.editing = '1';
        const input = document.createElement('input');
        input.type = 'number'; input.step = '0.01'; input.min = 0; input.className = 'form-control';
        input.value = (Number(trip.toll) || 0).toFixed(2);
        tollsEl.style.display = 'none';
        editBtn.textContent = 'Enregistrer';
        editBtn.classList.add('btn-save');
        editBtn.parentNode.insertBefore(input, editBtn);
        input.focus();

        const save = async () => {
            const v = parseFloat(input.value) || 0;
            // Update storage
            const tripsAll = getTrips();
            const idx = tripsAll.findIndex(t => t.id === trip.id);
            if (idx !== -1) {
                tripsAll[idx].toll = v;
                replaceTrips(tripsAll);
                tollsEl.textContent = v.toFixed(2);
                showToast('Péage mis à jour', {type:'success'});
                // update summary & ui
                updateSummary();
                loadHistory();
            }
            // cleanup
            input.remove();
            tollsEl.style.display = '';
            editBtn.textContent = 'Modifier';
            editBtn.classList.remove('btn-save');
            delete tollsEl.dataset.editing;
        };

        // handle enter and blur
        input.addEventListener('keydown', (e) => { if (e.key === 'Enter') save(); if (e.key === 'Escape') { input.remove(); tollsEl.style.display = ''; editBtn.textContent = 'Modifier'; delete tollsEl.dataset.editing; } });
        input.addEventListener('blur', () => { setTimeout(() => { if (document.activeElement !== input) { save(); } }, 120); });
    };

    distanceEl.textContent = trip.distance.toFixed(2);
    durationEl.textContent = trip.duration;
    startTimeEl.textContent = new Date(trip.startTime).toLocaleString();
    endTimeEl.textContent = new Date(trip.endTime).toLocaleString();
    remarkEl.textContent = trip.remark || "Aucune remarque";

    // Supprimer l'ancienne carte si présente
    if (detailMap) {
        detailMap.remove();
        detailMap = null;
    }

    // Initialiser la carte du trajet réel (en rouge)
    detailMap = L.map("map");
    window.detailMap = detailMap; // Expose globally for PDF export
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(detailMap);

    const realPath = trip.path.map(p => [p.lat, p.lng]);
    const polyline = L.polyline(realPath, {
        color: "red",
        weight: 4
    }).addTo(detailMap);

    detailMap.fitBounds(polyline.getBounds());
    // Leaflet nécessite invalidateSize après que la carte devienne visible
    setTimeout(() => { try { detailMap.invalidateSize(); } catch(e) {} }, 200);

    // gestion du focus et du clavier
    closeDetailsBtn.focus();
    modalKeyHandler = (e) => { if (e.key === 'Escape') closeDetails(); };
    document.addEventListener('keydown', modalKeyHandler);
    // piège de focus à l'intérieur de la modale
    if (typeof trapFocus === 'function') modalFocusCleanup = trapFocus(detailsEl);
}

// ========================
// FERMER LA MODALE DE DÉTAILS
// ========================
function closeDetails() {
    detailsEl.classList.add("hidden");
    overlayEl.classList.add("hidden");
    // restore scrolling and remove key handler
    document.body.classList.remove('no-scroll');
    if (modalKeyHandler) {
        document.removeEventListener('keydown', modalKeyHandler);
        modalKeyHandler = null;
    }
    if (modalFocusCleanup) {
        modalFocusCleanup();
        modalFocusCleanup = null;
    }
    if (detailMap) {
        detailMap.remove();
        detailMap = null;
    }
    
    // Clear trip data for PDF export
    if (typeof setTripForPDF === 'function') {
        setTripForPDF(null);
    }
}

// ========================
// BOUTONS
// ========================
backBtn.onclick = () => {
    window.location.href = "index.html";
};

closeDetailsBtn.onclick = closeDetails;
overlayEl.onclick = closeDetails;

clearHistoryBtn.onclick = () => {
    confirmToast("Voulez-vous vraiment effacer tout l'historique ?").then(ok => {
        if (!ok) return;
        localStorage.removeItem("trips");
        loadHistory();
        closeDetails();
        showToast("Historique effacé !", {type:'success'});
    });
};

function getHistory() {
    return getTrips();
}

function handleDeleteTrip(id) {
    confirmToast('Supprimer ce trajet ?').then(ok => {
        if (!ok) return;
        // find and remove the trip locally so we can offer undo
        const trips = getHistory();
        const idx = trips.findIndex(t => t.id === id);
        if (idx === -1) return;

        const [removed] = trips.splice(idx, 1);
        // persist
        replaceTrips(trips);
        loadHistory();

        // show undo toast
        showToast('Trajet supprimé', {
            type: 'success',
            timeout: 6000,
            actions: [
                { label: 'Annuler', onClick: () => { saveTrip(removed); loadHistory(); showToast('Suppression annulée', { type: 'info' }); } }
            ]
        });
    });
}

function calculerDistance(mode) {
    const now = new Date();
    let total = 0;

    getHistory().forEach(trajet => {
        // trips may store startTime/endTime instead of a 'date' property
        const d = new Date(trajet.date || trajet.startTime || trajet.endTime);
        if (isNaN(d)) return; // skip malformed entries

        if (mode === "month" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
            total += Number(trajet.distance) || 0;
        }

        if (mode === "year" && d.getFullYear() === now.getFullYear()) {
            total += Number(trajet.distance) || 0;
        }
    });

    document.getElementById("summaryDistance").textContent =
        total.toFixed(2);
}

function calculerTolls(mode) {
    const now = new Date();
    let total = 0;

    getHistory().forEach(trajet => {
        const d = new Date(trajet.date || trajet.startTime || trajet.endTime);
        if (isNaN(d)) return;

        if (mode === "month" && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()) {
            total += Number(trajet.toll) || 0;
        }

        if (mode === "year" && d.getFullYear() === now.getFullYear()) {
            total += Number(trajet.toll) || 0;
        }
    });

    document.getElementById('summaryToll').textContent = total.toFixed(2);
}

const switchInput = document.getElementById("summarySwitch");
const modeLabel = document.getElementById("summaryMode");
const title = document.getElementById("summaryTitle");

function updateSummary() {
    if (!switchInput) return;
    if (switchInput.checked) {
        calculerDistance("year");
        calculerTolls("year");
        modeLabel.textContent = "Année";
        title.textContent = "Résumé de l’année";
    } else {
        calculerDistance("month");
        calculerTolls("month");
        modeLabel.textContent = "Mois";
        title.textContent = "Résumé du mois";
    }
}

if (switchInput) switchInput.addEventListener("change", updateSummary);

// affichage au chargement
updateSummary();

// ========================
// GESTION VOITURES : chargement
// ========================
function loadCars() {
    const cars = getCars();
    carsListEl.innerHTML = '';
    cars.forEach(c => carsListEl.appendChild(renderCarCard(c)));
    populateCarSelects();
    updateCarSummary();
}

// ========================
// INIT
// ========================
// ====== Export / Import JSON (trips + cars)
function exportData() {
    const data = {
        trips: getTrips(),
        cars: getCars()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `gps-export-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
}

async function importData(file, replace=false) {
    try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        const tripsIn = parsed.trips || [];
        const carsIn = parsed.cars || [];

        if (replace) {
            replaceTrips(tripsIn);
            replaceCars(carsIn);
        } else {
            // merge by id (append non-existing)
            const existingTrips = getTrips();
            const existingCars = getCars();
            const tripsToAdd = tripsIn.filter(t => !existingTrips.some(e => e.id === t.id));
            const carsToAdd = carsIn.filter(c => !existingCars.some(e => e.id === c.id));
            replaceTrips(existingTrips.concat(tripsToAdd));
            replaceCars(existingCars.concat(carsToAdd));
        }

        showToast('Données importées', {type:'success'});
        loadCars(); loadHistory(); updateSummary();
    } catch (e) {
        showToast('Import invalide', {type:'warning'});
    }
}

// wire buttons & file input
const exportBtn = document.getElementById('exportDataBtn');
const importBtn = document.getElementById('importDataBtn');
const importFile = document.getElementById('importDataFile');
if (exportBtn) exportBtn.addEventListener('click', exportData);
if (importBtn && importFile) importBtn.addEventListener('click', () => importFile.click());
if (importFile) importFile.addEventListener('change', async (e) => { if (e.target.files && e.target.files[0]) {
    // ask user to replace or merge
    const replace = await confirmToast('Remplacer les données existantes ? (Annuler pour fusionner)', {confirmLabel:'Remplacer', cancelLabel:'Fusionner'});
    await importData(e.target.files[0], !!replace);
    e.target.value = '';
}});

// Drag & drop image support on car preview
const carPreview = document.getElementById('carPreview');
if (carPreview) {
    carPreview.addEventListener('dragover', (ev) => { ev.preventDefault(); carPreview.style.opacity = 0.85; });
    carPreview.addEventListener('dragleave', () => { carPreview.style.opacity = ''; });
    carPreview.addEventListener('drop', async (ev) => {
        ev.preventDefault(); carPreview.style.opacity = '';
        const f = ev.dataTransfer && ev.dataTransfer.files && ev.dataTransfer.files[0];
        if (f) {
            try {
                const dataUrl = await _readFileAsDataURL(f);
                const img = document.getElementById('carPreviewImg'); 
                if (img) img.src = dataUrl;
                if (carImageUrlEl) carImageUrlEl.value = dataUrl;
            } catch (e) {
                console.warn('Drag-drop image read failed', e);
            }
        }
    });
}

loadHistory();
loadCars();


