/* ============================
   APP.JS - MAIN GPS TRACKING APPLICATION
   ============================
   
   Core functionality for recording GPS trips including:
   - Map initialization (Leaflet.js)
   - Geolocation permission handling
   - Real-time GPS tracking (watchPosition)
   - Route calculation and visualization
   - Trip start/stop/save logic
   - Fallback to simulated tracking
   
   Dependencies:
   - Leaflet.js (mapping)
   - OpenStreetMap Nominatim (geocoding/reverse-geocoding)
   - OSRM Router (route calculation)
   - storage.js (localStorage management)
   - ui.js (toast notifications)
   
   ============================ */

/* ========================
   MAP INITIALIZATION
   ======================== */
const map = L.map('map').setView([48.8566, 2.3522], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// ========================
// HTML ELEMENT REFERENCES
// ========================
const startCityEl = document.getElementById("startCity");
const endInput = document.getElementById("end");
const startBtn = document.getElementById("startTrip");
const stopBtn = document.getElementById("stopTrip");
const liveStatus = document.getElementById("liveStatus");
const retryGeoBtn = document.getElementById('retryGeoBtn');
if (retryGeoBtn) retryGeoBtn.addEventListener('click', async () => {
    showToast('Demande de géolocalisation...', {type:'info'});
    try {
        const pos = await getCurrentPosition();
        startCoords = [pos.coords.latitude, pos.coords.longitude];
        try { startCityName = await reverseGeocode(startCoords[0], startCoords[1]); startCityEl.textContent = startCityName; } catch(e){ /* ignore */ }
        showToast('Position obtenue', {type:'success'});
    } catch (e) {
        showToast('Impossible d\'obtenir la position', {type:'warning'});
    }
});

const resultBox = document.getElementById("result");
const distanceEl = document.getElementById("distance");
const durationEl = document.getElementById("duration");
const startTimeEl = document.getElementById("startTime");
const endTimeEl = document.getElementById("endTime");

// Select de véhicule pour sauvegarde (index)
const carSelectForSave = document.getElementById('carSelectForSave');
function populateCarSelectForSave() {
    if (!carSelectForSave) return;
    const cars = (typeof getCars === 'function') ? getCars() : [];
    carSelectForSave.innerHTML = '<option value="">-- Aucun --</option>';
    cars.forEach(c => {
        const opt = document.createElement('option'); opt.value = c.id; opt.textContent = c.name; carSelectForSave.appendChild(opt);
    });
}

// Remplissage initial du select (au chargement de la page)
try { populateCarSelectForSave(); } catch(e) {}

// Mettre à jour automatiquement si la clé 'cars' change (autre onglet / dashboard)
window.addEventListener('storage', (e) => {
    if (e.key === 'cars') {
        try { populateCarSelectForSave(); } catch(err) { console.warn('Impossible de mettre à jour car select', err); }
    }
});

const firstname = document.getElementById("firstname");
const lastname = document.getElementById("lastname");
const remark = document.getElementById("remark");
const tollInput = document.getElementById('toll');
const clearTollBtn = document.getElementById('clearTollBtn');

// Ensure toll input exists on load
if (tollInput) tollInput.value = tollInput.value || '0';
if (clearTollBtn) clearTollBtn.addEventListener('click', () => { if (tollInput) tollInput.value = '0'; showToast('Péage réinitialisé', {type:'info'}); });



// ========================
// APPLICATION STATE VARIABLES
// ========================
let startCoords = null;
let startCityName = null;
let endCoords = null;
let startTime = null;
let promptTriedThisSession = false;
let traveledDistance = 0;
let lastPosition = null;
let marker = null;
let polylineReal = null;
let polylineEst = null;
let watchId = null;
let currentRoute = null;
let fakeIntervalId = null;

// ========================
// GEOLOCATION PERMISSION MANAGEMENT
// ========================
// Handles GPS permission requests and tracking
// Stores permission state in localStorage to avoid redundant prompts
let gpsAllowed = localStorage.getItem("gpsAllowed") === "true";

// ========================
// GEOLOCATION API FUNCTIONS
// ========================
// getCurrentPosition() - Request one-time position
// getGeolocationPermissionState() - Check current permission state
// ensureGeolocationPermission() - Smart permission handling (avoid repeated prompts)
async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject("GPS non disponible");

        navigator.geolocation.getCurrentPosition(
            pos => {
                gpsAllowed = true;
                localStorage.setItem("gpsAllowed", "true");
                localStorage.setItem("gpsAsked", "true");
                resolve(pos);
            },
            err => {
                // si refus explicite, on marque qu'on a déjà demandé pour éviter de relancer la demande automatiquement
                if (err && err.code === err.PERMISSION_DENIED) {
                    localStorage.setItem("gpsAsked", "true");
                }
                reject(err);
            },
            { enableHighAccuracy: true }
        );
    });
}

/**
 * Retourne l'état de permission connu: 'granted', 'denied', 'prompt', ou 'unsupported'
 */
async function getGeolocationPermissionState() {
    if (!navigator.permissions) return 'unsupported';
    try {
        const p = await navigator.permissions.query({ name: 'geolocation' });
        return p.state; // 'granted' | 'denied' | 'prompt'
    } catch (e) {
        return 'unsupported';
    }
}

/**
 * S'assure qu'on ne demande la permission qu'une seule fois.
 * Retourne:
 * - 'granted' : permission accordée
 * - 'denied'  : permission refusée
 * - 'prompt-will-ask' : état 'prompt' et on va demander
 * - 'prompt-already-asked' : état 'prompt' mais on a déjà demandé auparavant (ne pas redemander)
 * - 'unsupported' : API Permissions non disponible (on demandera une fois et on enregistrera gpsAsked)
 */
async function ensureGeolocationPermission() {
    const state = await getGeolocationPermissionState();
    const gpsAsked = localStorage.getItem("gpsAsked") === "true";

    if (state === 'granted') return 'granted';
    if (state === 'denied') return 'denied';
    if (state === 'prompt') {
        if (!gpsAsked) {
            // demande initiale : on va appeler getCurrentPosition qui déclenchera la popup
            return 'prompt-will-ask';
        } else {
            // déjà demandé, ne pas re-solliciter automatiquement
            return 'prompt-already-asked';
        }
    }
    // unsupported fallback
    if (!gpsAsked) return 'prompt-will-ask';
    return 'prompt-already-asked';
}

// ========================
// INITIALIZATION - START POSITION
// ========================
// Automatically request user location on page load
// Updates map view and enables start button
// Falls back to manual entry if GPS is unavailable
(async function initStart() {
    try {
        const perm = await ensureGeolocationPermission();
        if (perm === 'granted' || perm === 'prompt-will-ask') {
            const pos = await getCurrentPosition();
            startCoords = [pos.coords.latitude, pos.coords.longitude];

            // Récupérer ville/adresse (reverse geocoding)
            try {
                const label = await reverseGeocode(startCoords[0], startCoords[1]);
                startCityName = label || 'Position actuelle';
                startCityEl.textContent = startCityName;
                marker = L.marker(startCoords).addTo(map).bindPopup(`Départ — ${startCityName}`).openPopup();
            } catch (e) {
                // fallback
                startCityName = 'Position actuelle';
                startCityEl.textContent = startCityName;
                marker = L.marker(startCoords).addTo(map).bindPopup('Départ').openPopup();
            }

            startBtn.disabled = false;
            map.setView(startCoords, 13);
            // remplir le select de véhicules sur la page d'enregistrement
            try { populateCarSelectForSave(); } catch(e) {}
        } else if (perm === 'prompt-already-asked' && !promptTriedThisSession) {
            // Tentative unique de relance pendant la session
            promptTriedThisSession = true;
            try {
                showToast("Demande d'autorisation GPS (tentative unique)...", {type:'info', timeout:5000});
                const pos = await getCurrentPosition();
                startCoords = [pos.coords.latitude, pos.coords.longitude];

                try {
                    const label = await reverseGeocode(startCoords[0], startCoords[1]);
                    startCityName = label || 'Position actuelle';
                    startCityEl.textContent = startCityName;
                    marker = L.marker(startCoords).addTo(map).bindPopup(`Départ — ${startCityName}`).openPopup();
                } catch (e) {
                    startCityName = 'Position actuelle';
                    startCityEl.textContent = startCityName;
                    marker = L.marker(startCoords).addTo(map).bindPopup('Départ').openPopup();
                }

                startBtn.disabled = false;
                map.setView(startCoords, 13);
            } catch (e) {
                startCityEl.textContent = "Géolocalisation désactivée";
                console.warn('Géolocalisation non autorisée ou déjà refusée');
                startBtn.disabled = true;
                showToast("Autorisation de géolocalisation non accordée. Activez-la dans les paramètres de votre navigateur pour utiliser le GPS.", {type:'warning', timeout:10000});
            }
        } else {
            startCityEl.textContent = "Géolocalisation désactivée";
            console.warn('Géolocalisation non autorisée ou déjà refusée');
            startBtn.disabled = true;
            showToast("Autorisation de géolocalisation non accordée. Activez-la dans les paramètres de votre navigateur pour utiliser le GPS.", {type:'warning', timeout:10000});
        }
    } catch (err) {
        startCityEl.textContent = "Impossible de récupérer la position";
        console.error(err);
        startBtn.disabled = true;
    }
})();

// ========================
// TRIP START - REQUEST DESTINATION & TRACKING
// ========================
// 1. Validates destination city input
// 2. Calculates estimated route (OSRM)
// 3. Initiates real-time GPS tracking (watchPosition)
// 4. Falls back to simulated tracking if GPS unavailable
startBtn.onclick = async () => {
    const endCity = endInput.value.trim();
    if (!endCity) return showToast("Veuillez saisir la ville d'arrivée", {type:'warning'});

    endCoords = await geocode(endCity);
    if (!endCoords) return showToast("Ville d'arrivée introuvable", {type:'warning'});

    // Route estimée
    currentRoute = await getRoute(startCoords, endCoords);
    if (!currentRoute) return showToast("Impossible de calculer l'itinéraire", {type:'warning'});
    
    // Show info section when trip starts
    if (document.getElementById('info')) {
        document.getElementById('info').classList.add('active');
    }
    
    drawEstimatedRoute(currentRoute);

    // Préparer suivi réel
    startTime = new Date();
    traveledDistance = 0;
    lastPosition = startCoords;

    if (polylineReal) map.removeLayer(polylineReal);
    polylineReal = L.polyline([startCoords], { color: 'red', weight: 4 }).addTo(map);

    stopBtn.disabled = false;
    startBtn.disabled = true;

    // Lancer suivi réel
    try {
        let perm = await ensureGeolocationPermission();

        // Si la permission n'est pas encore accordée, essayer une relance explicite (action utilisateur)
        if (perm !== 'granted') {
            try {
                showToast("Demande d'autorisation GPS (depuis Démarrer)...", {type:'info', timeout:4000});
                // getCurrentPosition déclenche la popup si possible (et enregistre gpsAsked)
                const pos = await getCurrentPosition();
                // on a la position actuelle — mettre à jour la référence de départ et le label
                startCoords = [pos.coords.latitude, pos.coords.longitude];
                try {
                    const label = await reverseGeocode(startCoords[0], startCoords[1]);
                    startCityName = label || startCityName || 'Position actuelle';
                    startCityEl.textContent = startCityName;
                    if (marker) marker.setLatLng(startCoords).bindPopup(`Départ — ${startCityName}`);
                    else marker = L.marker(startCoords).addTo(map).bindPopup(`Départ — ${startCityName}`).openPopup();
                } catch (e) {
                    // ignore
                }
                perm = 'granted';
            } catch (err) {
                console.warn('Lancement : pas de permission GPS, on passe en simulation', err);
                showToast("Autorisation de géolocalisation non accordée — utilisation d'une simulation", {type:'warning'});
                startFakeTracking();
                return;
            }
        }

        // A ce stade, soit perm === 'granted' soit on a déjà fallback
        if (perm === 'granted') {
            watchId = navigator.geolocation.watchPosition(updatePosition, err => {
                console.warn('Erreur watchPosition', err);
                if (watchId) { navigator.geolocation.clearWatch(watchId); watchId = null; }
                showToast("Impossible de suivre le GPS — utilisation d'une simulation", {type:'warning'});
                startFakeTracking();
            }, {
                enableHighAccuracy: true,
                maximumAge: 0
            });
        } else {
            // Cas improbable : fallback
            showToast("Autorisation de géolocalisation non accordée — utilisation d'une simulation", {type:'warning'});
            startFakeTracking();
        }
    } catch (e) {
        console.error(e);
        showToast("Erreur lors de la vérification des permissions — simulation activée", {type:'warning'});
        startFakeTracking();
    }
};

// ========================
// GEOCODING - CITY NAME TO COORDINATES
// ========================
// Uses OpenStreetMap Nominatim API
// Returns [latitude, longitude] or null if not found
async function geocode(city) {
    try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}`);
        if (!res.ok) { console.warn('Geocode failed:', res.status); return null; }
        const data = await res.json();
        if (!Array.isArray(data) || !data.length) return null;
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    } catch (e) {
        console.warn('Geocode error:', e);
        return null;
    }
}

// ========================
// REVERSE GEOCODING - COORDINATES TO ADDRESS
// ========================
// Convert GPS coordinates to city/address name
// Fallback chain: city > town > village > county > road > full address
async function reverseGeocode(lat, lon) {
    try {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
        const res = await fetch(url);
        const data = await res.json();
        if (!data) return null;
        const addr = data.address || {};
        // Priorité : city / town / village / hamlet, sinon route + numéro, sinon display_name
        const city = addr.city || addr.town || addr.village || addr.hamlet || addr.county;
        const road = addr.road ? (addr.house_number ? `${addr.road} ${addr.house_number}` : addr.road) : null;
        return city || road || data.display_name || null;
    } catch (e) {
        console.warn('Reverse geocoding failed', e);
        return null;
    }
}

// ========================
// ESTIMATED ROUTE (BLUE DASHED LINE)
// ========================
// Requests route from OSRM routing engine
// Draws estimated path on map before actual tracking starts
async function getRoute(start, end) {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (!res.ok) { console.warn('Route failed:', res.status); return null; }
        const data = await res.json();
        const route = data?.routes?.[0];
        if (!route?.geometry?.coordinates?.length) return null;
        return route;
    } catch (e) {
        console.warn('Route error:', e);
        return null;
    }
}

function drawEstimatedRoute(route) {
    if (polylineEst) map.removeLayer(polylineEst);
    const coords = route.geometry.coordinates.map(c => [c[1], c[0]]);
    polylineEst = L.polyline(coords, { color: 'blue', weight: 4, dashArray: "6 6" }).addTo(map);
    map.fitBounds(polylineEst.getBounds());

    liveStatus.innerHTML = `Estimation : ${(route.distance/1000).toFixed(1)} km – ${Math.round(route.duration/60)} min<br>En attente du déplacement réel…`;
}

// ========================
// REAL-TIME POSITION UPDATE (GPS TRACKING)
// ========================
// Called repeatedly by navigator.geolocation.watchPosition()
// Updates polyline, marker, and accumulated distance
// Updates UI with live tracking information
function updatePosition(pos) {
    const latlng = [pos.coords.latitude, pos.coords.longitude];
    if (lastPosition) traveledDistance += getDistance(lastPosition, latlng);
    lastPosition = latlng;

    if (!polylineReal) polylineReal = L.polyline([latlng], { color: 'red', weight: 4 }).addTo(map);
    else polylineReal.addLatLng(latlng);

    if (!marker) marker = L.marker(latlng).addTo(map);
    else marker.setLatLng(latlng);

    if (liveStatus) liveStatus.textContent = `Trajet en cours – ${traveledDistance.toFixed(2)} km (±${Math.round(pos.coords.accuracy)}m)`;
}

// ========================
// TRIP STOP - END TRACKING & SHOW RESULTS
// ========================
// Stops GPS tracking
// Calculates final distance and duration
// Shows result form with recorded data
stopBtn.onclick = () => {
    if (fakeIntervalId) { clearInterval(fakeIntervalId); fakeIntervalId = null; }
    if (watchId) { navigator.geolocation.clearWatch(watchId); watchId = null; }
    
    if (!startTime) { showToast("Aucun trajet en cours", {type:'warning'}); return; }
    
    // Hide info section when trip stops
    if (document.getElementById('info')) {
        document.getElementById('info').classList.remove('active');
    }
    
    const endTime = new Date();
    const durationMin = Math.round((endTime - startTime)/60000);

    resultBox.classList.remove("hidden");
    distanceEl.textContent = `Distance réelle : ${traveledDistance.toFixed(2)} km`;
    durationEl.textContent = `Durée réelle : ${durationMin} min`;
    startTimeEl.textContent = `Départ : ${startTime.toLocaleString()}`;
    endTimeEl.textContent = `Arrivée : ${endTime.toLocaleString()}`;

    // afficher le montant de péage (si présent) et permettre édition
    const tollResult = document.getElementById('tollResult');
    if (tollResult && tollInput) {
        tollInput.value = tollInput.value || '0';
        tollResult.textContent = `Péages : ${parseFloat(tollInput.value || 0).toFixed(2)} €`;
        tollInput.focus();
    }

    stopBtn.disabled = true;
    startBtn.disabled = false;
};

// ========================
// TRIP SAVE - PERSIST TO STORAGE
// ========================
// Validates form data and saves trip to localStorage
// Associates trip with selected vehicle if applicable
// Reloads page after successful save
document.getElementById("saveTrip").onclick = () => {
    const endTime = new Date();
    const chosenCar = (document.getElementById('carSelectForSave') || {}).value || null;
    saveTrip({
        startCity: startCityName || "Position actuelle",
        endCity: endInput.value.trim(),
        distance: traveledDistance,
        duration: Math.round((endTime - startTime)/60000),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        firstname: firstname.value,
        lastname: lastname.value,
        remark: remark.value,
        path: polylineReal.getLatLngs(),
        estimatedPath: polylineEst ? polylineEst.getLatLngs() : null,
        carId: chosenCar,
        toll: (tollInput && parseFloat(tollInput.value)) ? parseFloat(tollInput.value) : 0
    });

    // remember last used vehicle
    if (chosenCar) {
        try { localStorage.setItem('lastCarId', chosenCar); } catch(e){}
    }

    showToast("Trajet enregistré avec succès !", {type:'success'});
    setTimeout(() => location.reload(), 700);
};

// ========================
// DISTANCE CALCULATION (HAVERSINE FORMULA)
// ========================
// Calculates great-circle distance between two GPS coordinates
// Input: [lat, lon] arrays
// Returns: distance in kilometers
function getDistance(a, b) {
    const R = 6371; // km
    const dLat = (b[0]-a[0])*Math.PI/180;
    const dLon = (b[1]-a[1])*Math.PI/180;
    const lat1 = a[0]*Math.PI/180;
    const lat2 = b[0]*Math.PI/180;
    const x = Math.sin(dLat/2)**2 + Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLon/2)**2;
    return 2*R*Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
}

// ========================
// SIMULATED TRACKING (FALLBACK)
// ========================
// Used when GPS is unavailable or not authorized
// Animates along estimated route at regular intervals
// Allows users to test the app without GPS hardware
function startFakeTracking() {
    if (!polylineEst) {
        showToast("Pas d'itinéraire estimé disponible pour la simulation", {type:'warning'});
        return;
    }
    const coords = polylineEst.getLatLngs();
    if (!coords || coords.length === 0) {
        showToast("Itinéraire vide, simulation impossible", {type:'warning'});
        return;
    }
    
    if (fakeIntervalId) clearInterval(fakeIntervalId);
    
    let idx = 0;
    fakeIntervalId = setInterval(() => {
        if (idx >= coords.length) {
            clearInterval(fakeIntervalId);
            fakeIntervalId = null;
            stopBtn.onclick();
            return;
        }
        const latlng = [coords[idx].lat, coords[idx].lng];
        if (!polylineReal) polylineReal = L.polyline([latlng], { color: 'red', weight: 4 }).addTo(map);
        else polylineReal.addLatLng(latlng);

        if (!marker) marker = L.marker(latlng).addTo(map);
        else marker.setLatLng(latlng);

        traveledDistance += idx > 0 ? getDistance([coords[idx-1].lat, coords[idx-1].lng], latlng) : 0;
        if (liveStatus) liveStatus.textContent = `Simulation – ${traveledDistance.toFixed(2)} km`;
        idx++;
    }, 500);
}
