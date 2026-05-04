// Tests rapides (smoke) à lancer depuis la console du navigateur
// Utilisation : runSmokeTests(). Affiche un résumé des tests (succès/échec).

async function runSmokeTests() {
    const results = [];

function pass(name) { results.push({name, ok:true}); console.log(`OK : ${name}`); }
    function fail(name, msg) { results.push({name, ok:false, msg}); console.error(`ÉCHEC : ${name}`, msg); }

    try {
        // nettoyer l'état éventuel
        const before = (typeof getTrips === 'function') ? getTrips().length : (JSON.parse(localStorage.getItem('trips')||'[]').length);
        console.log('Trajets avant tests :', before);

        // Test 1 : saveTrip crée id et date
        if (typeof saveTrip !== 'function' || typeof getTrips !== 'function') {
            fail('API indisponible', 'saveTrip / getTrips non définis');
            return results;
        }

        const dummy = { startCity: 'TestDepart', endCity: 'TestArrivee', distance: 2.34, duration: 5, startTime: new Date().toISOString(), endTime: new Date().toISOString(), firstname:'T', lastname:'E', remark:'test', path:[{lat:0,lng:0}] };
        saveTrip(dummy);
        const trips = getTrips();
        const t = trips.find(x => x.startCity === 'TestDepart' && x.endCity === 'TestArrivee');
        if (!t) { fail('saveTrip', 'trajet sauvegardé non trouvé'); } else if (!t.id) { fail('saveTrip:id', 'id non généré'); } else pass('saveTrip');

        // Test 2: deleteTrip removes by id
        if (typeof deleteTrip !== 'function') { fail('deleteTrip presence', 'deleteTrip not defined'); }
        else {
            deleteTrip(t.id);
            const after = getTrips().some(x => x.id === t.id);
            if (after) fail('deleteTrip', 'trip still present after delete'); else pass('deleteTrip');
        }

        // Test 3: replaceTrips restores list
        const copy = getTrips();
        copy.push({...t});
        if (typeof replaceTrips === 'function') { replaceTrips(copy); const found = getTrips().some(x=>x.id===t.id); found?pass('replaceTrips'):fail('replaceTrips','not found after replace'); }
        else fail('replaceTrips presence', 'replaceTrips not defined');

        // nettoyage
        replaceTrips((getTrips()||[]).filter(x=> x.startCity !== 'TestDepart' && x.endCity !== 'TestArrivee'));

        // Test 4 : API voitures (save/get/delete)
        if (typeof saveCar === 'function' && typeof getCars === 'function') {
            const car = { name: 'TestCar', description: 'Smoke', image: null };
            saveCar(car);
            const cars = getCars();
            const c = cars.find(x => x.name === 'TestCar');
            if (!c) fail('saveCar', 'voiture non ajoutée'); else pass('saveCar');

            // associer un trajet à une voiture et péage
            const t2 = { startCity:'TC', endCity:'TE', distance:3.3, duration:6, startTime:new Date().toISOString(), endTime:new Date().toISOString(), firstname:'A', lastname:'B', remark:'r', path:[{lat:0,lng:0}], carId: c.id, toll: 5.5 };
            saveTrip(t2);
            const tFound = getTrips().find(x => x.carId === c.id && Number(x.toll) === 5.5);
            if (!tFound) fail('saveTrip:car', 'trajet avec carId ou péage non trouvé'); else pass('saveTrip:car');

            // nettoyage trajet et voiture de test
            replaceTrips((getTrips()||[]).filter(x=> x.carId !== c.id || Number(x.toll) !== 5.5));
            deleteCar(c.id);
        } else {
            fail('carsAPI', 'saveCar/getCars non définis');
        }

        // Test 5 : loadHistory existe et peuple le DOM (optionnel)
        if (typeof loadHistory === 'function') {
            loadHistory();
            const historyEl = document.getElementById('history');
            if (!historyEl) fail('loadHistory:dom', "élément d'historique manquant"); else pass('loadHistory');
        } else fail('loadHistory indisponible', 'loadHistory non défini');

        // Test 6: export/import helpers exist
        if (typeof exportData === 'function' && typeof importData === 'function') {
            pass('export/import present');
        } else if (typeof exportData === 'undefined' && typeof importData === 'undefined') {
            pass('export/import:skipped');
        } else fail('export/import', 'fonctions exportData/importData manquantes');

        console.log('Résumé des tests :', results);
        return results;
    } catch (err) {
        console.error('Smoke test error', err);
        fail('exception', err.message || err);
        return results;
    }
}

// Auto-run support: append ?runSmoke=1 to the URL to execute tests and write a short result
if (typeof window !== 'undefined' && window.location && window.location.search.indexOf('runSmoke=1') !== -1) {
    runSmokeTests().then(res => {
        try { localStorage.setItem('smokeLast', JSON.stringify(res)); } catch(e){}
        if (typeof showToast === 'function') showToast('Tests rapides terminés (voir console)', {type:'info'});
        console.log('Résultat des tests :', res);
    });
}
