/* ============================
   APP.JS - ENREGISTREMENT D'UN TRAJET GPS
   ============================

   - Carte Leaflet (tuiles OpenStreetMap)
   - Gestion de l'autorisation de géolocalisation (une seule demande)
   - Suivi en temps réel (watchPosition) avec filtrage des points imprécis
   - Itinéraire estimé (OSRM) et géocodage (Nominatim)
   - Mode simulation si le GPS est refusé ou indisponible :
     l'utilisateur saisit alors une ville de départ
   - Arrêt, récapitulatif et sauvegarde du trajet (storage.js)

   Dépendances : Leaflet, storage.js, ui.js
   ============================ */

/* ========================
   CARTE
   ======================== */
const map = L.map('map').setView([46.6, 2.4], 6);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    crossOrigin: true,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

/* ========================
   ÉLÉMENTS HTML
   ======================== */
const startCityEl = document.getElementById('startCity');
const startManualEl = document.getElementById('startManual');
const endInput = document.getElementById('end');
const startBtn = document.getElementById('startTrip');
const stopBtn = document.getElementById('stopTrip');
const retryGeoBtn = document.getElementById('retryGeoBtn');
const infoEl = document.getElementById('info');
const warningEl = document.getElementById('warning');
const liveStatus = document.getElementById('liveStatus');

const resultBox = document.getElementById('result');
const distanceEl = document.getElementById('distance');
const durationEl = document.getElementById('duration');
const startTimeEl = document.getElementById('startTime');
const endTimeEl = document.getElementById('endTime');
const tollResultEl = document.getElementById('tollResult');
const saveBtn = document.getElementById('saveTrip');

const firstname = document.getElementById('firstname');
const lastname = document.getElementById('lastname');
const remark = document.getElementById('remark');
const tollInput = document.getElementById('toll');
const clearTollBtn = document.getElementById('clearTollBtn');
const carSelectForSave = document.getElementById('carSelectForSave');

/* ========================
   ÉTAT DE L'APPLICATION
   ======================== */
let startCoords = null;      // [lat, lng] du départ
let startCityName = null;
let endCoords = null;
let startTime = null;
let tripEndTime = null;      // heure d'arrêt (utilisée à l'enregistrement)
let traveledDistance = 0;    // km
let lastPosition = null;
let marker = null;
let polylineReal = null;     // trajet réel (rouge)
let polylineEst = null;      // itinéraire estimé (bleu pointillé)
let watchId = null;
let fakeIntervalId = null;
let simulation = false;

// Points GPS ignorés : précision trop faible ou déplacement trop petit (bruit à l'arrêt)
const MAX_ACCURACY_M = 100;
const MIN_STEP_KM = 0.005;

/* ========================
   VÉHICULES (liste déroulante)
   ======================== */
function populateCarSelectForSave() {
    if (!carSelectForSave) return;
    const cars = getCars();
    carSelectForSave.innerHTML = '';
    carSelectForSave.add(new Option('-- Aucun --', ''));
    cars.forEach(c => carSelectForSave.add(new Option(c.name, c.id)));
    try {
        const last = localStorage.getItem('lastCarId');
        if (last && cars.some(c => c.id === last)) carSelectForSave.value = last;
    } catch (e) { /* stockage indisponible */ }
}
populateCarSelectForSave();

// Mise à jour si les véhicules changent dans un autre onglet (dashboard)
window.addEventListener('storage', (e) => {
    if (e.key === 'cars') populateCarSelectForSave();
});

if (clearTollBtn) clearTollBtn.addEventListener('click', () => {
    tollInput.value = '0';
    updateTollResult();
    showToast('Péage réinitialisé', { type: 'info' });
});
if (tollInput) tollInput.addEventListener('input', updateTollResult);

function updateTollResult() {
    if (tollResultEl) tollResultEl.textContent = `Péages : ${(parseFloat(tollInput.value) || 0).toFixed(2)} €`;
}

/* ========================
   GÉOLOCALISATION
   ======================== */
function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error('GPS non disponible'));
        navigator.geolocation.getCurrentPosition(
            pos => {
                try { localStorage.setItem('gpsAsked', 'true'); } catch (e) { /* ignore */ }
                resolve(pos);
            },
            err => {
                if (err && err.code === err.PERMISSION_DENIED) {
                    try { localStorage.setItem('gpsAsked', 'true'); } catch (e) { /* ignore */ }
                }
                reject(err);
            },
            { enableHighAccuracy: true, timeout: 15000 }
        );
    });
}

/** 'granted' | 'denied' | 'prompt' | 'unsupported' */
async function getGeolocationPermissionState() {
    if (!navigator.permissions) return 'unsupported';
    try {
        return (await navigator.permissions.query({ name: 'geolocation' })).state;
    } catch (e) {
        return 'unsupported';
    }
}

/** Place le marqueur de départ et affiche le nom de la ville. */
async function setStartPosition(coords, label) {
    startCoords = coords;
    startCityName = label || await reverseGeocode(coords[0], coords[1]) || 'Position actuelle';
    startCityEl.textContent = startCityName;
    if (marker) marker.setLatLng(coords);
    else marker = L.marker(coords).addTo(map);
    marker.bindPopup(`Départ — ${startCityName}`).openPopup();
    map.setView(coords, 13);
}

/** Passe en mode "sans GPS" : la ville de départ est saisie à la main. */
function enableManualStart(message) {
    simulation = true;
    startCityEl.textContent = message;
    startManualEl.classList.remove('hidden');
    startBtn.disabled = false;
}

async function locate({ explicit = false } = {}) {
    const state = await getGeolocationPermissionState();
    let asked = false;
    try { asked = localStorage.getItem('gpsAsked') === 'true'; } catch (e) { /* ignore */ }

    // On ne relance pas la popup automatiquement si l'utilisateur l'a déjà vue
    if (state === 'denied' || (!explicit && state !== 'granted' && asked)) {
        enableManualStart('GPS non autorisé — saisissez une ville de départ (simulation)');
        return false;
    }
    try {
        const pos = await getCurrentPosition();
        simulation = false;
        startManualEl.classList.add('hidden');
        await setStartPosition([pos.coords.latitude, pos.coords.longitude]);
        startBtn.disabled = false;
        return true;
    } catch (e) {
        enableManualStart('Position indisponible — saisissez une ville de départ (simulation)');
        return false;
    }
}

locate();

if (retryGeoBtn) retryGeoBtn.addEventListener('click', async () => {
    showToast('Demande de géolocalisation…', { type: 'info' });
    const ok = await locate({ explicit: true });
    showToast(ok ? 'Position obtenue' : "Impossible d'obtenir la position", { type: ok ? 'success' : 'warning' });
});

/* ========================
   SERVICES EN LIGNE (Nominatim / OSRM)
   ======================== */
async function geocode(city) {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(city)}`);
        if (!res.ok) return null;
        const data = await res.json();
        if (!Array.isArray(data) || !data.length) return null;
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } catch (e) {
        console.warn('Géocodage impossible :', e);
        return null;
    }
}

async function reverseGeocode(lat, lon) {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`);
        if (!res.ok) return null;
        const data = await res.json();
        const addr = data.address || {};
        const city = addr.city || addr.town || addr.village || addr.hamlet || addr.county;
        const road = addr.road ? (addr.house_number ? `${addr.road} ${addr.house_number}` : addr.road) : null;
        return city || road || data.display_name || null;
    } catch (e) {
        console.warn('Géocodage inverse impossible :', e);
        return null;
    }
}

async function getRoute(start, end) {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (!res.ok) return null;
        const route = (await res.json())?.routes?.[0];
        return route?.geometry?.coordinates?.length ? route : null;
    } catch (e) {
        console.warn('Itinéraire impossible :', e);
        return null;
    }
}

function drawEstimatedRoute(route) {
    if (polylineEst) map.removeLayer(polylineEst);
    const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
    polylineEst = L.polyline(coords, { color: 'blue', weight: 4, dashArray: '6 6' }).addTo(map);
    map.fitBounds(polylineEst.getBounds(), { padding: [20, 20] });
    liveStatus.textContent = `Estimation : ${(route.distance / 1000).toFixed(1)} km – ${Math.round(route.duration / 60)} min. En attente du déplacement…`;
}

/* ========================
   DÉMARRER UN TRAJET
   ======================== */
startBtn.addEventListener('click', async () => {
    const endCity = endInput.value.trim();
    if (!endCity) return showToast("Veuillez saisir la ville d'arrivée", { type: 'warning' });

    startBtn.disabled = true; // évite un double clic pendant les requêtes
    const abort = (message) => { startBtn.disabled = false; showToast(message, { type: 'warning' }); };

    // Départ saisi à la main (mode sans GPS)
    if (simulation) {
        const startCity = startManualEl.value.trim();
        if (!startCity) return abort('Veuillez saisir la ville de départ');
        const coords = await geocode(startCity);
        if (!coords) return abort('Ville de départ introuvable');
        await setStartPosition(coords, startCity);
    }
    if (!startCoords) return abort('Position de départ inconnue');

    endCoords = await geocode(endCity);
    if (!endCoords) return abort("Ville d'arrivée introuvable");

    const route = await getRoute(startCoords, endCoords);
    if (!route) return abort("Impossible de calculer l'itinéraire");

    resultBox.classList.add('hidden');
    infoEl.classList.add('active');
    drawEstimatedRoute(route);

    startTime = new Date();
    tripEndTime = null;
    traveledDistance = 0;
    lastPosition = startCoords;
    if (polylineReal) map.removeLayer(polylineReal);
    polylineReal = L.polyline([startCoords], { color: 'red', weight: 4 }).addTo(map);
    stopBtn.disabled = false;

    if (simulation || !navigator.geolocation) {
        startFakeTracking();
        return;
    }

    watchId = navigator.geolocation.watchPosition(updatePosition, err => {
        console.warn('Suivi GPS interrompu', err);
        stopWatching();
        showToast("Suivi GPS impossible — passage en simulation", { type: 'warning' });
        startFakeTracking();
    }, { enableHighAccuracy: true, maximumAge: 0 });
});

/* ========================
   SUIVI EN TEMPS RÉEL
   ======================== */
function updatePosition(pos) {
    if (pos.coords.accuracy > MAX_ACCURACY_M) return; // point trop imprécis
    const latlng = [pos.coords.latitude, pos.coords.longitude];
    marker.setLatLng(latlng);

    const step = getDistance(lastPosition, latlng);
    if (step < MIN_STEP_KM) return; // bruit GPS à l'arrêt
    traveledDistance += step;
    lastPosition = latlng;
    polylineReal.addLatLng(latlng);
    liveStatus.textContent = `Trajet en cours – ${traveledDistance.toFixed(2)} km (±${Math.round(pos.coords.accuracy)} m)`;
}

function stopWatching() {
    if (watchId !== null) { navigator.geolocation.clearWatch(watchId); watchId = null; }
    if (fakeIntervalId) { clearInterval(fakeIntervalId); fakeIntervalId = null; }
}

/* ========================
   SIMULATION (sans GPS)
   ========================
   Parcourt l'itinéraire estimé en ~30 secondes, quelle que soit sa longueur. */
function startFakeTracking() {
    const coords = polylineEst ? polylineEst.getLatLngs() : [];
    if (!coords.length) return showToast('Itinéraire vide, simulation impossible', { type: 'warning' });

    warningEl.classList.remove('hidden');
    const stride = Math.max(1, Math.ceil(coords.length / 60));
    let idx = 0;
    lastPosition = [coords[0].lat, coords[0].lng];

    stopWatching();
    fakeIntervalId = setInterval(() => {
        const next = Math.min(idx + stride, coords.length - 1);
        for (let i = idx + 1; i <= next; i++) {
            const p = [coords[i].lat, coords[i].lng];
            traveledDistance += getDistance(lastPosition, p);
            lastPosition = p;
            polylineReal.addLatLng(p);
        }
        marker.setLatLng(lastPosition);
        liveStatus.textContent = `Simulation – ${traveledDistance.toFixed(2)} km`;
        idx = next;
        if (idx >= coords.length - 1) stopTrip();
    }, 500);
}

/* ========================
   ARRÊTER LE TRAJET
   ======================== */
function stopTrip() {
    stopWatching();
    if (!startTime) return showToast('Aucun trajet en cours', { type: 'warning' });

    tripEndTime = new Date();
    infoEl.classList.remove('active');
    warningEl.classList.add('hidden');

    resultBox.classList.remove('hidden');
    distanceEl.textContent = `Distance : ${traveledDistance.toFixed(2)} km`;
    durationEl.textContent = `Durée : ${Math.round((tripEndTime - startTime) / 60000)} min`;
    startTimeEl.textContent = `Départ : ${startTime.toLocaleString('fr-FR')}`;
    endTimeEl.textContent = `Arrivée : ${tripEndTime.toLocaleString('fr-FR')}`;
    updateTollResult();
    populateCarSelectForSave();
    resultBox.scrollIntoView({ behavior: 'smooth' });

    stopBtn.disabled = true;
    startBtn.disabled = false;
}
stopBtn.addEventListener('click', stopTrip);

/* ========================
   ENREGISTRER LE TRAJET
   ======================== */
saveBtn.addEventListener('click', () => {
    if (!startTime || !tripEndTime) {
        return showToast("Arrêtez d'abord le trajet avant de l'enregistrer", { type: 'warning' });
    }
    const chosenCar = carSelectForSave ? carSelectForSave.value : '';
    const ok = saveTrip({
        startCity: startCityName || 'Position actuelle',
        endCity: endInput.value.trim(),
        distance: Number(traveledDistance.toFixed(3)),
        duration: Math.round((tripEndTime - startTime) / 60000),
        startTime: startTime.toISOString(),
        endTime: tripEndTime.toISOString(),
        firstname: firstname.value.trim(),
        lastname: lastname.value.trim(),
        remark: remark.value.trim(),
        path: polylineReal.getLatLngs().map(p => ({ lat: p.lat, lng: p.lng })),
        estimatedPath: polylineEst ? polylineEst.getLatLngs().map(p => ({ lat: p.lat, lng: p.lng })) : null,
        carId: chosenCar || null,
        toll: Math.max(0, parseFloat(tollInput.value) || 0),
        simulated: simulation
    });

    if (!ok) {
        return showToast("Enregistrement impossible : le stockage du navigateur est plein ou désactivé", { type: 'warning', timeout: 6000 });
    }
    if (chosenCar) {
        try { localStorage.setItem('lastCarId', chosenCar); } catch (e) { /* ignore */ }
    }
    showToast('Trajet enregistré avec succès !', { type: 'success' });
    setTimeout(() => location.reload(), 700);
});

/* ========================
   DISTANCE (formule de Haversine) en km
   ======================== */
function getDistance(a, b) {
    const R = 6371;
    const dLat = (b[0] - a[0]) * Math.PI / 180;
    const dLon = (b[1] - a[1]) * Math.PI / 180;
    const lat1 = a[0] * Math.PI / 180;
    const lat2 = b[0] * Math.PI / 180;
    const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}
