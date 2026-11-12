/* ============================
   STORAGE.JS - LOCALSTORAGE MANAGEMENT
   ============================

   Handles persistent data storage using browser's localStorage API.
   Manages two main data types:
   - Trips: GPS recorded journeys with distances, times, drivers, costs
   - Cars: Vehicle inventory with images and descriptions

   Data Structure:
   - localStorage['trips']: Array of trip objects
   - localStorage['cars']: Array of car objects

   Helper function _generateId() creates simple unique IDs

   ============================ */

/* ========================
   HELPER FUNCTIONS
   ======================== */
function _generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2,6);
}

function _safeSetItem(key, value) {
    try {
        localStorage.setItem(key, value);
        return true;
    } catch (e) {
        console.warn('localStorage write failed:', e);
        return false;
    }
}

function _safeGetItem(key, fallback = '[]') {
    try {
        return localStorage.getItem(key) || fallback;
    } catch (e) {
        console.warn('localStorage read failed:', e);
        return fallback;
    }
}

// Lit une liste JSON ; une valeur corrompue ne doit pas bloquer l'application.
function _readList(key) {
    try {
        const value = JSON.parse(_safeGetItem(key));
        return Array.isArray(value) ? value : [];
    } catch (e) {
        console.warn(`Donnees "${key}" illisibles, liste vide utilisee`, e);
        return [];
    }
}

/* ========================
   TRIP DATA MANAGEMENT
   ======================== */

function saveTrip(trip) {
    const trips = _readList("trips");
    trip.id = trip.id || _generateId();
    trip.date = trip.date || trip.startTime || new Date().toISOString();
    trips.push(trip);
    return _safeSetItem("trips", JSON.stringify(trips));
}

function getTrips() {
    return _readList("trips");
}

function deleteTrip(id) {
    const trips = _readList("trips");
    const filtered = trips.filter(t => t.id !== id);
    return _safeSetItem("trips", JSON.stringify(filtered));
}

function replaceTrips(trips) {
    return _safeSetItem("trips", JSON.stringify(trips));
}

/* ========================
   CAR DATA MANAGEMENT
   ======================== */
// Retourne le vehicule enregistre, ou null si le stockage est plein / indisponible.
function saveCar(car) {
    const cars = _readList("cars");
    car.id = car.id || _generateId();
    car.dateAdded = car.dateAdded || new Date().toISOString();
    cars.push(car);
    return _safeSetItem("cars", JSON.stringify(cars)) ? car : null;
}

function getCars() {
    return _readList("cars");
}

function getCarById(id) {
    const cars = getCars();
    return cars.find(c => c.id === id) || null;
}

function deleteCar(id) {
    const cars = getCars();
    const filtered = cars.filter(c => c.id !== id);
    return _safeSetItem("cars", JSON.stringify(filtered));
}

function replaceCars(cars) {
    return _safeSetItem("cars", JSON.stringify(cars));
}

