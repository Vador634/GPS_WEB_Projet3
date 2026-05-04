# Wipsee Mobile GPS

Application web de suivi GPS pour véhicules avec gestion de trajets et export PDF.

Web-based GPS tracking application for vehicles with trip management and PDF export.

---

# 🇫🇷 DOCUMENTATION FRANÇAISE

---

## 📖 MANUEL UTILISATEUR

### Comment Démarrer l'Application

1. **Ouvrir l'application**
   - Double-cliquez sur `index.html` pour ouvrir dans votre navigateur
   - Ou utilisez un serveur local (Live Server, Python, etc.)

2. **Autoriser la géolocalisation**
   - Le navigateur demandera l'accès à votre position
   - Cliquez sur **"Autoriser"** pour activer le GPS
   - Si vous refusez, l'application fonctionnera en mode simulation

---

### Enregistrer un Trajet

#### Étape 1 : Préparer le trajet
![Page d'accueil](https://via.placeholder.com/600x300?text=Page+Accueil)

1. Attendez que votre position s'affiche (ex: "Paris, France")
2. Si la position est incorrecte, cliquez sur **"Réessayer localisation"**
3. Dans le champ **"Ville d'arrivée"**, tapez votre destination (ex: "Lyon")

#### Étape 2 : Démarrer le suivi
1. Cliquez sur le bouton **"Démarrer"**
2. La carte affiche :
   - **Ligne bleue pointillée** : Itinéraire estimé
   - **Ligne rouge** : Votre trajet réel (se dessine au fur et à mesure)
   - **Marqueur** : Votre position actuelle
3. Le statut affiche la distance parcourue en temps réel

#### Étape 3 : Arrêter et sauvegarder
1. Une fois arrivé, cliquez sur **"Arrêter"**
2. Un formulaire apparaît avec :
   - Distance et durée calculées automatiquement
   - **Prénom** et **Nom** du conducteur
   - **Remarques** (optionnel) : notes sur le trajet
   - **Péages** : montant en euros (0 par défaut)
   - **Véhicule** : sélectionnez dans la liste (optionnel)
3. Cliquez sur **"Valider le trajet"** pour sauvegarder

#### Mode Simulation (sans GPS)
- Si le GPS n'est pas disponible, l'application simule automatiquement le trajet
- Le marqueur se déplace le long de l'itinéraire estimé
- Utile pour tester l'application ou en intérieur

---

### Gérer les Véhicules

#### Accéder au Dashboard
1. Depuis la page d'accueil, cliquez sur **"Voir le dashboard"** en bas
2. Ou ouvrez directement `dashboard.html`

#### Créer un véhicule
1. Dans la section **"Créer un véhicule"** :
   - **Nom du véhicule** (obligatoire) : ex. "Renault Clio"
   - **Image** : 
     - Cliquez sur **"Choisir une image"** pour uploader depuis votre ordinateur
     - Ou collez une URL d'image dans le champ prévu
   - **Description** (optionnel) : ex. "Grise, 5 places, climatisation"
2. L'aperçu de l'image s'affiche à droite
3. Cliquez sur **"Ajouter"**
4. Le véhicule apparaît dans la liste "Mes véhicules"

#### Gérer les véhicules existants
- **Sélectionner** : Cliquez sur "Sélectionner" pour filtrer l'historique par ce véhicule
- **Supprimer** : Cliquez sur "Supprimer" (une confirmation sera demandée)

---

### Consulter l'Historique

#### Voir tous les trajets
1. Dans le dashboard, la liste des trajets s'affiche sous "Mes véhicules"
2. Chaque trajet montre :
   - Ville de départ → Ville d'arrivée
   - Distance en km
   - Véhicule utilisé (si sélectionné)
   - Péages (si renseignés)

#### Filtrer par véhicule
1. Dans **"Afficher récap pour"**, sélectionnez un véhicule
2. Seuls les trajets de ce véhicule s'affichent
3. Le total km est mis à jour

#### Voir les détails d'un trajet
1. Cliquez sur un trajet dans la liste
2. Une fenêtre popup s'ouvre avec :
   - Informations complètes (conducteur, véhicule, distances, heures)
   - Carte du trajet réel
   - Option de modifier les péages
3. Fermez avec le **✕** ou la touche **Échap**

#### Supprimer un trajet
1. Cliquez sur l'icône 🗑️ à droite du trajet
2. Confirmez la suppression
3. Un bouton **"Annuler"** permet de restaurer pendant 6 secondes

---

### Exporter en PDF

#### Depuis le Dashboard
1. Ouvrez les détails d'un trajet (cliquez dessus)
2. Cliquez sur **"Exporter en PDF"**
3. Le fichier PDF est téléchargé automatiquement

#### Contenu du PDF
- En-tête Wipsee Mobile GPS
- Informations du trajet (distance, durée, heures)
- Informations conducteur
- Frais de péages
- Remarques
- Date de génération

---

### Statistiques

#### Résumé mensuel/annuel
1. En bas du dashboard, section **"Résumé du mois"**
2. Utilisez l'interrupteur pour basculer entre :
   - **Mois** : Statistiques du mois en cours
   - **Année** : Statistiques de l'année en cours
3. Affiche :
   - Total des kilomètres parcourus
   - Total des dépenses de péages

---

### Exporter/Importer les Données

#### Exporter toutes les données
1. Dans le dashboard, cliquez sur **"Exporter JSON"**
2. Un fichier `.json` est téléchargé avec tous vos trajets et véhicules
3. Utile pour sauvegarder ou transférer vers un autre navigateur

#### Importer des données
1. Cliquez sur **"Importer JSON"**
2. Sélectionnez un fichier `.json` précédemment exporté
3. Choisissez :
   - **Remplacer** : Efface les données existantes
   - **Fusionner** : Ajoute sans supprimer l'existant

---

### Conseils d'Utilisation

#### Pour une meilleure précision GPS
- Utilisez l'application en extérieur
- Attendez quelques secondes que le GPS se stabilise
- Évitez les tunnels et parkings souterrains

#### Pour économiser de l'espace
- Les images de véhicules sont stockées localement
- Préférez les URLs d'images plutôt que les fichiers volumineux
- Supprimez les anciens trajets si nécessaire

#### En cas de problème
- **GPS bloqué** : Vérifiez les permissions dans les paramètres du navigateur
- **Page blanche** : Rafraîchissez la page (F5)
- **Données perdues** : Vérifiez que vous n'êtes pas en navigation privée

---

### Raccourcis Clavier

| Touche | Action |
|--------|--------|
| **Échap** | Fermer la fenêtre de détails |
| **Entrée** | Sélectionner un véhicule (quand focus sur la carte) |
| **Tab** | Naviguer entre les éléments |

---

## 📱 Présentation du Projet

**Wipsee Mobile GPS** est une application web de suivi GPS qui enregistre les trajets de véhicules en temps réel, gère un inventaire de véhicules et génère des rapports PDF professionnels.

### Fonctionnalités Principales
- ✅ Suivi GPS en temps réel avec cartographie Leaflet.js
- ✅ Gestion des véhicules avec upload d'images
- ✅ Historique des trajets avec analyses détaillées
- ✅ Export PDF des rapports de trajets
- ✅ Suivi des frais de péage
- ✅ Statistiques mensuelles/globales
- ✅ Design responsive moderne
- ✅ Persistance localStorage (aucun serveur requis)

---

## 📁 Structure du Projet

```
gps web/
├── index.html          # Page d'enregistrement des trajets
├── dashboard.html      # Gestion des véhicules et historique
├── README.md           # Cette documentation
├── css/
│   └── style.css       # Système de design moderne
└── js/
    ├── app.js          # Logique principale de suivi GPS
    ├── dashboard.js    # Gestion dashboard véhicules/historique
    ├── storage.js      # Wrapper API localStorage
    ├── ui.js           # Notifications toast et accessibilité
    ├── pdf-export.js   # Génération PDF (html2pdf)
    └── smoke.js        # Utilitaires de test
```

---

## 📄 Description Détaillée des Fichiers

### index.html - Page d'Enregistrement

**Rôle** : Interface principale pour enregistrer un nouveau trajet GPS.

**Sections** :
- **Header** : Titre de l'application "Wipsee Mobile GPS"
- **Formulaire de route** : 
  - Affichage de la ville de départ (géolocalisation automatique)
  - Champ de saisie pour la ville d'arrivée
  - Boutons Démarrer/Arrêter/Réessayer localisation
- **Section info** : Messages de statut en temps réel
- **Carte** : Conteneur Leaflet.js pour afficher le trajet
- **Section résultat** : Formulaire de saisie après arrêt du trajet
  - Distance et durée calculées
  - Prénom/Nom du conducteur
  - Remarques
  - Frais de péage
  - Sélection du véhicule
  - Bouton de validation

**Scripts chargés** :
1. Leaflet.js (cartographie)
2. html2pdf.js (export PDF)
3. storage.js (données)
4. ui.js (notifications)
5. pdf-export.js (export)
6. smoke.js (tests)
7. app.js (logique principale)

---

### dashboard.html - Tableau de Bord

**Rôle** : Gestion des véhicules, visualisation de l'historique et statistiques.

**Sections** :
- **Header** : Titre "Dashboard GPS"
- **Bouton retour** : Navigation vers index.html
- **Panneau création véhicule** :
  - Formulaire avec nom, image (URL ou fichier), description
  - Aperçu de l'image du véhicule
- **Liste des véhicules** : Cartes avec actions (sélectionner, supprimer)
- **Récapitulatif véhicule** : Total km par véhicule, export/import JSON
- **Historique** : Liste des trajets avec détails
- **Résumé statistiques** : Distance totale et péages (mois/année)
- **Modal détails** : Popup avec carte du trajet et export PDF

**Scripts chargés** : Même ordre que index.html + dashboard.js

---

### css/style.css - Système de Design

**Rôle** : Définit l'apparence visuelle complète de l'application.

**Organisation** (dans l'ordre) :

1. **Variables CSS (:root)** - Lignes 30-73
   - Couleurs de fond : `--bg`, `--bg-secondary`, `--card`
   - Couleurs texte : `--text`, `--text-secondary`, `--text-muted`
   - Boutons : `--button-bg`, `--button-hover`, `--button-border`
   - Accents : `--primary`, `--accent`, `--danger`, `--success`, `--warning`
   - Espacement : `--gap`, `--gap-sm`, `--gap-lg`
   - Bordures : `--radius`, `--radius-sm`, `--radius-lg`
   - Ombres : `--shadow-sm`, `--shadow`, `--shadow-lg`

2. **Reset & Base** - Lignes 78-137
   - Reset box-sizing
   - Styles body (police, couleurs, padding)
   - Titres (h1, h2, h3)
   - Header et footer

3. **Utilitaires** - Lignes 142-174
   - `.sr-only` : Masquage accessible
   - `.card` : Style carte
   - `.hidden` : Masquage
   - `.no-scroll` : Bloquer défilement
   - `.muted` : Texte atténué

4. **Système de Boutons** - Lignes 178-270
   - `.btn` : Style de base
   - `.btn-primary` : Bouton principal
   - `.btn-accent` : Bouton accent
   - `.btn-ghost` : Bouton transparent
   - `.btn-block` : Pleine largeur
   - `.btn-sm` : Petite taille
   - `.delete-btn` : Suppression (rouge au survol)

5. **Contrôles de Formulaire** - Lignes 288-353
   - Labels, inputs, textareas, selects
   - États focus avec bordure primaire
   - Formulaire de route (#route-form)

6. **Carte** - Lignes 357-363
   - #map : Hauteur 65vh, coins arrondis

7. **Section Résultat** - Lignes 368-399
   - #info, #liveStatus : Statut centré
   - #warning : Texte rouge
   - #result : Carte avec formulaire

8. **Historique** - Lignes 403-452
   - #history : Liste des trajets
   - Effets hover et focus
   - .history-empty : État vide

9. **Résumé Distance** - Lignes 456-479
   - #distanceSummary : Carte statistiques
   - .summary-header, .summary-value

10. **Gestion Véhicules** - Lignes 483-662
    - .cars-list : Grille de véhicules
    - .car-card : Carte véhicule
    - .car-preview : Aperçu image
    - .car-actions : Boutons d'action
    - Formulaire création compact

11. **Modal & Overlay** - Lignes 667-732
    - #overlay : Fond semi-transparent
    - .modal : Popup centré
    - .close-btn : Bouton fermeture

12. **Switch/Toggle** - Lignes 736-777
    - .switch : Interrupteur mois/année
    - Animation du curseur

13. **Toasts/Notifications** - Lignes 781-824
    - .toast : Notification popup
    - Variantes : info, success, warning
    - Animations show/hide

14. **Responsive** - Lignes 828-870
    - @media (max-width: 900px) : Tablettes
    - @media (max-width: 600px) : Mobiles

---

### js/storage.js - Gestion des Données

**Rôle** : Interface avec localStorage pour sauvegarder trajets et véhicules.

**Fonctions Utilitaires** :
- `_generateId()` : Génère un ID unique (timestamp + random)
- `_safeSetItem(key, value)` : Écriture localStorage avec gestion d'erreur
- `_safeGetItem(key, fallback)` : Lecture localStorage avec valeur par défaut

**Gestion des Trajets** :
- `saveTrip(trip)` : Sauvegarde un trajet (ajoute id et date automatiquement)
- `getTrips()` : Récupère tous les trajets
- `deleteTrip(id)` : Supprime un trajet par ID
- `replaceTrips(trips)` : Remplace tous les trajets

**Gestion des Véhicules** :
- `saveCar(car)` : Sauvegarde un véhicule (ajoute id et dateAdded)
- `getCars()` : Récupère tous les véhicules
- `getCarById(id)` : Récupère un véhicule par ID
- `deleteCar(id)` : Supprime un véhicule
- `replaceCars(cars)` : Remplace tous les véhicules

**Structure de Données** :

```javascript
// Trajet
{
  id: "lxyz1234",
  date: "2026-01-19T10:00:00.000Z",
  startCity: "Paris",
  endCity: "Lyon",
  distance: 463.5,           // km
  duration: 420,             // minutes
  startTime: "2026-01-19T10:00:00.000Z",
  endTime: "2026-01-19T17:00:00.000Z",
  firstname: "Jean",
  lastname: "Dupont",
  remark: "Livraison client",
  path: [{lat: 48.8566, lng: 2.3522}, ...],
  estimatedPath: [{lat: 48.8566, lng: 2.3522}, ...],
  carId: "abc5678",          // optionnel
  toll: 45.50                // € péages
}

// Véhicule
{
  id: "abc5678",
  name: "Renault Clio",
  description: "Grise, 5 places",
  image: "data:image/jpeg;base64,..." ou "https://...",
  dateAdded: "2026-01-15T08:00:00.000Z"
}
```

---

### js/ui.js - Interface Utilisateur

**Rôle** : Composants UI réutilisables (notifications, modales).

**Constantes** :
- `toastContainerId` : ID du conteneur de notifications

**Fonctions** :

1. `createToastContainer()` - Lignes 29-42
   - Crée le conteneur de toasts s'il n'existe pas
   - Positionné en bas à droite (fixed)
   - Attribut aria-live pour accessibilité

2. `showToast(message, options)` - Lignes 44-86
   - **Paramètres** :
     - `message` : Texte à afficher
     - `options.type` : 'info' | 'success' | 'warning'
     - `options.timeout` : Durée en ms (défaut 3500, 0 = permanent)
     - `options.actions` : Tableau de boutons [{label, onClick}]
   - **Comportement** :
     - Crée un élément toast avec animation
     - Pause auto-dismiss au survol
     - Reprend le timer au départ de la souris
   - **Retourne** : Objet avec méthode `remove()`

3. `confirmToast(message, options)` - Lignes 94-98
   - **Paramètres** :
     - `message` : Question de confirmation
     - `options.confirmLabel` : Texte bouton confirmer (défaut "Confirmer")
     - `options.cancelLabel` : Texte bouton annuler (défaut "Annuler")
   - **Retourne** : Promise qui résout à true/false

4. `trapFocus(container)` - Lignes 109-126
   - Piège le focus clavier dans un conteneur (modal)
   - Empêche la tabulation en dehors
   - **Retourne** : Fonction de nettoyage

---

### js/app.js - Logique GPS Principale

**Rôle** : Gère l'enregistrement des trajets GPS sur index.html.

**Initialisation Carte** - Lignes 25-26 :
- Crée la carte Leaflet centrée sur Paris
- Ajoute les tuiles OpenStreetMap

**Références DOM** - Lignes 31-84 :
- Récupère tous les éléments HTML nécessaires
- Configure le bouton "Réessayer localisation"
- Initialise le sélecteur de véhicules

**Variables d'État** - Lignes 91-103 :
- `startCoords` : Coordonnées de départ [lat, lon]
- `startCityName` : Nom de la ville de départ
- `endCoords` : Coordonnées d'arrivée
- `startTime` : Heure de départ (Date)
- `traveledDistance` : Distance parcourue en km
- `lastPosition` : Dernière position GPS
- `marker` : Marqueur Leaflet
- `polylineReal` : Tracé réel (rouge)
- `polylineEst` : Tracé estimé (bleu pointillé)
- `watchId` : ID du watcher GPS
- `fakeIntervalId` : ID de l'intervalle simulation

**Gestion Permissions GPS** - Lignes 107-180 :
- `getCurrentPosition()` : Demande position unique
- `getGeolocationPermissionState()` : Vérifie état permission
- `ensureGeolocationPermission()` : Logique intelligente pour éviter demandes répétées

**Initialisation Position** - Lignes 188-250 :
- IIFE asynchrone exécutée au chargement
- Demande la géolocalisation
- Affiche la ville de départ
- Place le marqueur sur la carte

**Démarrage Trajet** - Lignes 257-332 :
- Vérifie les coordonnées de départ
- Géocode la ville d'arrivée
- Calcule la route estimée (OSRM)
- Dessine la route estimée en bleu
- Lance le suivi GPS (watchPosition)
- Fallback vers simulation si GPS indisponible

**Géocodage** - Lignes 341-352 :
- `geocode(city)` : Convertit nom de ville → coordonnées
- Utilise API Nominatim OpenStreetMap
- Gestion d'erreur robuste

**Géocodage Inverse** - Lignes 359-374 :
- `reverseGeocode(lat, lon)` : Convertit coordonnées → adresse
- Priorité : ville > route > adresse complète

**Calcul de Route** - Lignes 381-394 :
- `getRoute(start, end)` : Obtient itinéraire via OSRM
- Retourne géométrie GeoJSON

**Dessin Route Estimée** - Lignes 396-402 :
- `drawEstimatedRoute(route)` : Trace en bleu pointillé
- Ajuste le zoom pour voir tout le trajet

**Mise à Jour Position** - Lignes 408-420 :
- `updatePosition(pos)` : Callback du watchPosition
- Calcule distance incrémentale (Haversine)
- Met à jour le tracé rouge et le marqueur
- Affiche distance et précision GPS

**Arrêt du Trajet** - Lignes 426-450 :
- Arrête le GPS et la simulation
- Calcule la durée totale
- Affiche le formulaire de résultat
- Prépare les données pour sauvegarde

**Sauvegarde Trajet** - Lignes 456-482 :
- Collecte toutes les données du formulaire
- Appelle `saveTrip()` de storage.js
- Mémorise le dernier véhicule utilisé
- Recharge la page

**Calcul Distance (Haversine)** - Lignes 488-497 :
- `getDistance(a, b)` : Distance entre 2 points GPS
- Formule du grand cercle
- Retourne distance en km

**Simulation GPS** - Lignes 503-546 :
- `startFakeTracking()` : Fallback si GPS indisponible
- Anime le marqueur le long de la route estimée
- Intervalle de 500ms entre chaque point
- Déclenche automatiquement l'arrêt à la fin

---

### js/dashboard.js - Logique Dashboard

**Rôle** : Gère l'affichage de l'historique et la gestion des véhicules.

**Références DOM** - Lignes 4-31 :
- Éléments historique, modal, boutons
- Éléments du formulaire véhicule

**Helpers Véhicules** - Lignes 34-93 :
- `_readFileAsDataURL(file)` : Convertit fichier en base64
- `addCarFromForm()` : Ajoute un véhicule depuis le formulaire
- Gestion image URL ou fichier
- Animation de mise en évidence après ajout

**Rendu Carte Véhicule** - Lignes 95-123 :
- `renderCarCard(car)` : Crée une carte HTML pour un véhicule
- Boutons Sélectionner et Supprimer
- Support clavier (Enter/Espace)

**Population Sélecteurs** - Lignes 125-165 :
- `populateCarSelects()` : Remplit les listes déroulantes
- Restaure le dernier véhicule utilisé

**Résumé Véhicule** - Lignes 167-175 :
- `updateCarSummary()` : Calcule km total par véhicule

**Initialisation UI Véhicule** - Lignes 183-211 :
- Bouton "Choisir une image"
- Preview de l'image
- URL d'image en temps réel

**Chargement Historique** - Lignes 217-279 :
- `loadHistory()` : Charge et affiche les trajets
- Assigne des IDs aux anciens trajets
- Filtre par véhicule sélectionné
- Crée les éléments de liste avec bouton supprimer

**Ouverture Détails** - Lignes 284-376 :
- `openDetails(trip)` : Affiche la modal de détail
- Remplit les informations du trajet
- Affiche la carte du trajet
- Édition inline des péages
- Piège le focus et gère Escape

**Fermeture Détails** - Lignes 380-397 :
- `closeDetails()` : Ferme la modal
- Nettoie les event listeners
- Détruit la carte Leaflet

**Boutons Navigation** - Lignes 402-417 :
- Retour à l'accueil
- Fermeture modal
- Effacement historique (avec confirmation)

**Suppression Trajet** - Lignes 424-446 :
- `handleDeleteTrip(id)` : Supprime avec undo
- Toast avec bouton "Annuler"

**Calculs Statistiques** - Lignes 448-493 :
- `calculerDistance(mode)` : Total km mois/année
- `calculerTolls(mode)` : Total péages mois/année
- `updateSummary()` : Met à jour l'affichage

**Chargement Véhicules** - Lignes 503-509 :
- `loadCars()` : Charge et affiche les véhicules

**Export/Import JSON** - Lignes 515-579 :
- `exportData()` : Télécharge trajets + véhicules en JSON
- `importData(file, replace)` : Importe depuis fichier JSON
- Option fusionner ou remplacer

**Drag & Drop Image** - Lignes 581-596 :
- Support glisser-déposer sur l'aperçu
- Lecture du fichier et preview

---

### js/pdf-export.js - Export PDF

**Rôle** : Génère des rapports PDF des trajets.

**Initialisation** - Lignes 6-11 :
- Attache le listener au bouton d'export

**Export Principal** - Lignes 13-77 :
- `exportTripToPDF()` :
  - Vérifie la disponibilité de html2pdf
  - Détecte le contexte (modal ou résultat)
  - Collecte les données du trajet
  - Crée un conteneur temporaire hors-écran
  - Configure les options PDF (A4, portrait)
  - Génère et télécharge le PDF
  - Nettoie le conteneur temporaire

**Génération Contenu** - Lignes 79-163 :
- `generatePDFContent(data)` : Crée le HTML du rapport
- Sections : Header, Infos trajet, Conducteur, Frais, Remarques, Footer
- Style inline pour compatibilité PDF

---

### js/smoke.js - Tests Automatisés

**Rôle** : Tests rapides pour vérifier le bon fonctionnement.

**Fonction Principale** - Lignes 4-86 :
- `runSmokeTests()` : Exécute tous les tests
- Tests effectués :
  1. saveTrip crée id et date
  2. deleteTrip supprime par id
  3. replaceTrips restaure la liste
  4. API voitures (save/get/delete)
  5. loadHistory fonctionne
  6. export/import disponibles

**Auto-exécution** - Lignes 89-95 :
- Ajouter `?runSmoke=1` à l'URL pour lancer automatiquement

---

## 🔄 Flux de Données

### Enregistrement d'un Trajet

```
1. Utilisateur ouvre index.html
   ↓
2. app.js demande géolocalisation
   ↓
3. Position obtenue → reverseGeocode() → Affiche ville
   ↓
4. Utilisateur saisit destination → Clic "Démarrer"
   ↓
5. geocode(destination) → getRoute() → drawEstimatedRoute()
   ↓
6. watchPosition() lance le suivi GPS
   ↓
7. updatePosition() à chaque mouvement
   ↓
8. Clic "Arrêter" → Affiche formulaire
   ↓
9. Clic "Valider" → saveTrip() → localStorage
   ↓
10. Rechargement page
```

### Consultation Dashboard

```
1. Utilisateur ouvre dashboard.html
   ↓
2. loadHistory() → getTrips() → Affiche liste
   ↓
3. loadCars() → getCars() → Affiche véhicules
   ↓
4. updateSummary() → Calcule statistiques
   ↓
5. Clic sur trajet → openDetails() → Modal
   ↓
6. Clic "Exporter PDF" → exportTripToPDF() → Téléchargement
```

---

## 🐛 Guide de Débogage

### Console Navigateur

```javascript
// Voir tous les trajets
console.log(getTrips());

// Voir tous les véhicules
console.log(getCars());

// Effacer toutes les données
localStorage.clear();

// Lancer les tests
runSmokeTests();
```

### Problèmes Courants

| Problème | Cause | Solution |
|----------|-------|----------|
| GPS ne fonctionne pas | Permission refusée | Vérifier paramètres navigateur |
| Carte vide | Pas de connexion | Vérifier internet |
| PDF vide | Élément caché | Corrigé (positionnement off-screen) |
| Suppression ne marche pas | confirmToast manquant | Corrigé (fonction déclarée) |
| Toast permanent | Pas de mouseleave | Corrigé (timer relancé) |

---

## 🔒 Sécurité et Confidentialité

- ✅ Toutes les données stockées localement (localStorage)
- ✅ Aucune communication serveur
- ✅ Aucun tracking ou analytics
- ✅ Données restent sur l'appareil
- ✅ Permission GPS révocable dans le navigateur

---

## ⚠️ Limitations Connues

1. **Précision GPS** : Dépend du matériel de l'appareil
2. **Stockage** : localStorage limité à 5-10 Mo
3. **Hors-ligne** : Géocodage et calcul de route nécessitent internet
4. **Navigateurs** : Requiert navigateur moderne (Chrome, Firefox, Safari, Edge)

---

---

# 🇬🇧 ENGLISH DOCUMENTATION

---

## 📖 USER MANUAL

### How to Start the Application

1. **Open the application**
   - Double-click on `index.html` to open in your browser
   - Or use a local server (Live Server, Python, etc.)

2. **Allow geolocation**
   - The browser will ask for access to your location
   - Click **"Allow"** to enable GPS
   - If you decline, the application will work in simulation mode

---

### Recording a Trip

#### Step 1: Prepare the trip
![Home page](https://via.placeholder.com/600x300?text=Home+Page)

1. Wait for your position to display (e.g., "Paris, France")
2. If the position is incorrect, click **"Réessayer localisation"** (Retry location)
3. In the **"Ville d'arrivée"** (Destination city) field, type your destination (e.g., "Lyon")

#### Step 2: Start tracking
1. Click the **"Démarrer"** (Start) button
2. The map displays:
   - **Blue dashed line**: Estimated route
   - **Red line**: Your actual path (draws as you move)
   - **Marker**: Your current position
3. The status shows distance traveled in real-time

#### Step 3: Stop and save
1. Once arrived, click **"Arrêter"** (Stop)
2. A form appears with:
   - Automatically calculated distance and duration
   - **Prénom** (First name) and **Nom** (Last name) of the driver
   - **Remarques** (Remarks - optional): notes about the trip
   - **Péages** (Tolls): amount in euros (0 by default)
   - **Véhicule** (Vehicle): select from the list (optional)
3. Click **"Valider le trajet"** (Validate trip) to save

#### Simulation Mode (without GPS)
- If GPS is not available, the application automatically simulates the trip
- The marker moves along the estimated route
- Useful for testing the application or indoors

---

### Managing Vehicles

#### Access the Dashboard
1. From the home page, click **"Voir le dashboard"** (View dashboard) at the bottom
2. Or directly open `dashboard.html`

#### Create a vehicle
1. In the **"Créer un véhicule"** (Create a vehicle) section:
   - **Nom du véhicule** (Vehicle name - required): e.g., "Renault Clio"
   - **Image**: 
     - Click **"Choisir une image"** (Choose an image) to upload from your computer
     - Or paste an image URL in the provided field
   - **Description** (optional): e.g., "Gray, 5 seats, air conditioning"
2. The image preview displays on the right
3. Click **"Ajouter"** (Add)
4. The vehicle appears in the "Mes véhicules" (My vehicles) list

#### Manage existing vehicles
- **Select**: Click "Sélectionner" to filter history by this vehicle
- **Delete**: Click "Supprimer" (a confirmation will be requested)

---

### Viewing History

#### View all trips
1. In the dashboard, the trip list displays under "Mes véhicules"
2. Each trip shows:
   - Departure city → Arrival city
   - Distance in km
   - Vehicle used (if selected)
   - Tolls (if entered)

#### Filter by vehicle
1. In **"Afficher récap pour"** (Show summary for), select a vehicle
2. Only trips for that vehicle are displayed
3. The total km is updated

#### View trip details
1. Click on a trip in the list
2. A popup window opens with:
   - Complete information (driver, vehicle, distances, times)
   - Map of the actual trip
   - Option to edit tolls
3. Close with **✕** or the **Escape** key

#### Delete a trip
1. Click the 🗑️ icon to the right of the trip
2. Confirm the deletion
3. An **"Annuler"** (Undo) button allows restoration for 6 seconds

---

### Export to PDF

#### From the Dashboard
1. Open the trip details (click on it)
2. Click **"Exporter en PDF"** (Export to PDF)
3. The PDF file is downloaded automatically

#### PDF Contents
- Wipsee Mobile GPS header
- Trip information (distance, duration, times)
- Driver information
- Toll costs
- Remarks
- Generation date

---

### Statistics

#### Monthly/yearly summary
1. At the bottom of the dashboard, section **"Résumé du mois"** (Monthly summary)
2. Use the toggle switch to switch between:
   - **Mois** (Month): Current month statistics
   - **Année** (Year): Current year statistics
3. Displays:
   - Total kilometers traveled
   - Total toll expenses

---

### Export/Import Data

#### Export all data
1. In the dashboard, click **"Exporter JSON"** (Export JSON)
2. A `.json` file is downloaded with all your trips and vehicles
3. Useful for backup or transfer to another browser

#### Import data
1. Click **"Importer JSON"** (Import JSON)
2. Select a previously exported `.json` file
3. Choose:
   - **Remplacer** (Replace): Deletes existing data
   - **Fusionner** (Merge): Adds without deleting existing

---

### Usage Tips

#### For better GPS accuracy
- Use the application outdoors
- Wait a few seconds for GPS to stabilize
- Avoid tunnels and underground parking

#### To save space
- Vehicle images are stored locally
- Prefer image URLs rather than large files
- Delete old trips if necessary

#### In case of problems
- **GPS blocked**: Check permissions in browser settings
- **Blank page**: Refresh the page (F5)
- **Lost data**: Make sure you're not in private browsing mode

---

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Escape** | Close the details window |
| **Enter** | Select a vehicle (when focus on card) |
| **Tab** | Navigate between elements |

---

## 📱 Project Overview

**Wipsee Mobile GPS** is a web-based GPS tracking application that records vehicle trips in real-time, manages vehicle inventory, and generates professional PDF reports.

### Key Features
- ✅ Real-time GPS tracking with Leaflet.js mapping
- ✅ Vehicle management with image uploads
- ✅ Trip history with detailed analytics
- ✅ PDF export for trip reports
- ✅ Toll cost tracking
- ✅ Monthly/yearly statistics
- ✅ Fully responsive modern design
- ✅ localStorage persistence (no backend required)

---

## 📁 Project Structure

```
gps web/
├── index.html          # Trip recording page
├── dashboard.html      # Vehicle & history management
├── README.md           # This documentation
├── css/
│   └── style.css       # Modern design system
└── js/
    ├── app.js          # Main GPS tracking logic
    ├── dashboard.js    # Dashboard vehicle/history management
    ├── storage.js      # localStorage API wrapper
    ├── ui.js           # Toast notifications & accessibility
    ├── pdf-export.js   # PDF generation (html2pdf)
    └── smoke.js        # Testing utilities
```

---

## 📄 Detailed File Descriptions

### index.html - Recording Page

**Role**: Main interface for recording a new GPS trip.

**Sections**:
- **Header**: Application title "Wipsee Mobile GPS"
- **Route form**: 
  - Departure city display (automatic geolocation)
  - Destination city input field
  - Start/Stop/Retry location buttons
- **Info section**: Real-time status messages
- **Map**: Leaflet.js container for trip display
- **Result section**: Input form after stopping trip
  - Calculated distance and duration
  - Driver first/last name
  - Remarks
  - Toll costs
  - Vehicle selection
  - Validation button

**Scripts loaded**:
1. Leaflet.js (mapping)
2. html2pdf.js (PDF export)
3. storage.js (data)
4. ui.js (notifications)
5. pdf-export.js (export)
6. smoke.js (tests)
7. app.js (main logic)

---

### dashboard.html - Dashboard

**Role**: Vehicle management, history viewing, and statistics.

**Sections**:
- **Header**: Title "Dashboard GPS"
- **Back button**: Navigation to index.html
- **Vehicle creation panel**:
  - Form with name, image (URL or file), description
  - Vehicle image preview
- **Vehicle list**: Cards with actions (select, delete)
- **Vehicle summary**: Total km per vehicle, JSON export/import
- **History**: Trip list with details
- **Statistics summary**: Total distance and tolls (month/year)
- **Details modal**: Popup with trip map and PDF export

**Scripts loaded**: Same order as index.html + dashboard.js

---

### css/style.css - Design System

**Role**: Defines the complete visual appearance of the application.

**Organization** (in order):

1. **CSS Variables (:root)** - Lines 30-73
   - Background colors: `--bg`, `--bg-secondary`, `--card`
   - Text colors: `--text`, `--text-secondary`, `--text-muted`
   - Buttons: `--button-bg`, `--button-hover`, `--button-border`
   - Accents: `--primary`, `--accent`, `--danger`, `--success`, `--warning`
   - Spacing: `--gap`, `--gap-sm`, `--gap-lg`
   - Borders: `--radius`, `--radius-sm`, `--radius-lg`
   - Shadows: `--shadow-sm`, `--shadow`, `--shadow-lg`

2. **Reset & Base** - Lines 78-137
   - Box-sizing reset
   - Body styles (font, colors, padding)
   - Headings (h1, h2, h3)
   - Header and footer

3. **Utilities** - Lines 142-174
   - `.sr-only`: Accessible hiding
   - `.card`: Card style
   - `.hidden`: Hiding
   - `.no-scroll`: Block scrolling
   - `.muted`: Muted text

4. **Button System** - Lines 178-270
   - `.btn`: Base style
   - `.btn-primary`: Primary button
   - `.btn-accent`: Accent button
   - `.btn-ghost`: Transparent button
   - `.btn-block`: Full width
   - `.btn-sm`: Small size
   - `.delete-btn`: Delete (red on hover)

5. **Form Controls** - Lines 288-353
   - Labels, inputs, textareas, selects
   - Focus states with primary border
   - Route form (#route-form)

6. **Map** - Lines 357-363
   - #map: Height 65vh, rounded corners

7. **Result Section** - Lines 368-399
   - #info, #liveStatus: Centered status
   - #warning: Red text
   - #result: Card with form

8. **History** - Lines 403-452
   - #history: Trip list
   - Hover and focus effects
   - .history-empty: Empty state

9. **Distance Summary** - Lines 456-479
   - #distanceSummary: Statistics card
   - .summary-header, .summary-value

10. **Vehicle Management** - Lines 483-662
    - .cars-list: Vehicle grid
    - .car-card: Vehicle card
    - .car-preview: Image preview
    - .car-actions: Action buttons
    - Compact creation form

11. **Modal & Overlay** - Lines 667-732
    - #overlay: Semi-transparent background
    - .modal: Centered popup
    - .close-btn: Close button

12. **Switch/Toggle** - Lines 736-777
    - .switch: Month/year toggle
    - Cursor animation

13. **Toasts/Notifications** - Lines 781-824
    - .toast: Popup notification
    - Variants: info, success, warning
    - Show/hide animations

14. **Responsive** - Lines 828-870
    - @media (max-width: 900px): Tablets
    - @media (max-width: 600px): Mobiles

---

### js/storage.js - Data Management

**Role**: Interface with localStorage to save trips and vehicles.

**Utility Functions**:
- `_generateId()`: Generates unique ID (timestamp + random)
- `_safeSetItem(key, value)`: localStorage write with error handling
- `_safeGetItem(key, fallback)`: localStorage read with default value

**Trip Management**:
- `saveTrip(trip)`: Saves a trip (auto-adds id and date)
- `getTrips()`: Retrieves all trips
- `deleteTrip(id)`: Deletes a trip by ID
- `replaceTrips(trips)`: Replaces all trips

**Vehicle Management**:
- `saveCar(car)`: Saves a vehicle (auto-adds id and dateAdded)
- `getCars()`: Retrieves all vehicles
- `getCarById(id)`: Retrieves a vehicle by ID
- `deleteCar(id)`: Deletes a vehicle
- `replaceCars(cars)`: Replaces all vehicles

**Data Structures**:

```javascript
// Trip
{
  id: "lxyz1234",
  date: "2026-01-19T10:00:00.000Z",
  startCity: "Paris",
  endCity: "Lyon",
  distance: 463.5,           // km
  duration: 420,             // minutes
  startTime: "2026-01-19T10:00:00.000Z",
  endTime: "2026-01-19T17:00:00.000Z",
  firstname: "John",
  lastname: "Doe",
  remark: "Client delivery",
  path: [{lat: 48.8566, lng: 2.3522}, ...],
  estimatedPath: [{lat: 48.8566, lng: 2.3522}, ...],
  carId: "abc5678",          // optional
  toll: 45.50                // € tolls
}

// Vehicle
{
  id: "abc5678",
  name: "Renault Clio",
  description: "Gray, 5 seats",
  image: "data:image/jpeg;base64,..." or "https://...",
  dateAdded: "2026-01-15T08:00:00.000Z"
}
```

---

### js/ui.js - User Interface

**Role**: Reusable UI components (notifications, modals).

**Constants**:
- `toastContainerId`: Toast container ID

**Functions**:

1. `createToastContainer()` - Lines 29-42
   - Creates toast container if it doesn't exist
   - Positioned bottom right (fixed)
   - aria-live attribute for accessibility

2. `showToast(message, options)` - Lines 44-86
   - **Parameters**:
     - `message`: Text to display
     - `options.type`: 'info' | 'success' | 'warning'
     - `options.timeout`: Duration in ms (default 3500, 0 = permanent)
     - `options.actions`: Button array [{label, onClick}]
   - **Behavior**:
     - Creates animated toast element
     - Pauses auto-dismiss on hover
     - Resumes timer on mouse leave
   - **Returns**: Object with `remove()` method

3. `confirmToast(message, options)` - Lines 94-98
   - **Parameters**:
     - `message`: Confirmation question
     - `options.confirmLabel`: Confirm button text (default "Confirmer")
     - `options.cancelLabel`: Cancel button text (default "Annuler")
   - **Returns**: Promise resolving to true/false

4. `trapFocus(container)` - Lines 109-126
   - Traps keyboard focus in a container (modal)
   - Prevents tabbing outside
   - **Returns**: Cleanup function

---

### js/app.js - Main GPS Logic

**Role**: Manages GPS trip recording on index.html.

**Map Initialization** - Lines 25-26:
- Creates Leaflet map centered on Paris
- Adds OpenStreetMap tiles

**DOM References** - Lines 31-84:
- Retrieves all necessary HTML elements
- Configures "Retry location" button
- Initializes vehicle selector

**State Variables** - Lines 91-103:
- `startCoords`: Starting coordinates [lat, lon]
- `startCityName`: Starting city name
- `endCoords`: Destination coordinates
- `startTime`: Departure time (Date)
- `traveledDistance`: Distance traveled in km
- `lastPosition`: Last GPS position
- `marker`: Leaflet marker
- `polylineReal`: Real path (red)
- `polylineEst`: Estimated path (blue dashed)
- `watchId`: GPS watcher ID
- `fakeIntervalId`: Simulation interval ID

**GPS Permission Management** - Lines 107-180:
- `getCurrentPosition()`: Requests single position
- `getGeolocationPermissionState()`: Checks permission state
- `ensureGeolocationPermission()`: Smart logic to avoid repeated requests

**Position Initialization** - Lines 188-250:
- Async IIFE executed on load
- Requests geolocation
- Displays starting city
- Places marker on map

**Trip Start** - Lines 257-332:
- Verifies starting coordinates
- Geocodes destination city
- Calculates estimated route (OSRM)
- Draws estimated route in blue
- Starts GPS tracking (watchPosition)
- Falls back to simulation if GPS unavailable

**Geocoding** - Lines 341-352:
- `geocode(city)`: Converts city name → coordinates
- Uses Nominatim OpenStreetMap API
- Robust error handling

**Reverse Geocoding** - Lines 359-374:
- `reverseGeocode(lat, lon)`: Converts coordinates → address
- Priority: city > road > full address

**Route Calculation** - Lines 381-394:
- `getRoute(start, end)`: Gets route via OSRM
- Returns GeoJSON geometry

**Draw Estimated Route** - Lines 396-402:
- `drawEstimatedRoute(route)`: Draws in blue dashed line
- Adjusts zoom to see entire trip

**Position Update** - Lines 408-420:
- `updatePosition(pos)`: watchPosition callback
- Calculates incremental distance (Haversine)
- Updates red path and marker
- Displays distance and GPS accuracy

**Trip Stop** - Lines 426-450:
- Stops GPS and simulation
- Calculates total duration
- Shows result form
- Prepares data for saving

**Trip Save** - Lines 456-482:
- Collects all form data
- Calls `saveTrip()` from storage.js
- Remembers last used vehicle
- Reloads page

**Distance Calculation (Haversine)** - Lines 488-497:
- `getDistance(a, b)`: Distance between 2 GPS points
- Great circle formula
- Returns distance in km

**GPS Simulation** - Lines 503-546:
- `startFakeTracking()`: Fallback if GPS unavailable
- Animates marker along estimated route
- 500ms interval between points
- Automatically triggers stop at end

---

### js/dashboard.js - Dashboard Logic

**Role**: Manages history display and vehicle management.

**DOM References** - Lines 4-31:
- History, modal, button elements
- Vehicle form elements

**Vehicle Helpers** - Lines 34-93:
- `_readFileAsDataURL(file)`: Converts file to base64
- `addCarFromForm()`: Adds vehicle from form
- Handles URL or file image
- Highlight animation after adding

**Vehicle Card Rendering** - Lines 95-123:
- `renderCarCard(car)`: Creates HTML card for vehicle
- Select and Delete buttons
- Keyboard support (Enter/Space)

**Selector Population** - Lines 125-165:
- `populateCarSelects()`: Fills dropdown lists
- Restores last used vehicle

**Vehicle Summary** - Lines 167-175:
- `updateCarSummary()`: Calculates total km per vehicle

**Vehicle UI Initialization** - Lines 183-211:
- "Choose image" button
- Image preview
- Real-time image URL

**History Loading** - Lines 217-279:
- `loadHistory()`: Loads and displays trips
- Assigns IDs to old trips
- Filters by selected vehicle
- Creates list elements with delete button

**Open Details** - Lines 284-376:
- `openDetails(trip)`: Shows detail modal
- Fills trip information
- Displays trip map
- Inline toll editing
- Traps focus and handles Escape

**Close Details** - Lines 380-397:
- `closeDetails()`: Closes modal
- Cleans up event listeners
- Destroys Leaflet map

**Navigation Buttons** - Lines 402-417:
- Back to home
- Close modal
- Clear history (with confirmation)

**Trip Deletion** - Lines 424-446:
- `handleDeleteTrip(id)`: Deletes with undo
- Toast with "Undo" button

**Statistics Calculations** - Lines 448-493:
- `calculerDistance(mode)`: Total km month/year
- `calculerTolls(mode)`: Total tolls month/year
- `updateSummary()`: Updates display

**Vehicle Loading** - Lines 503-509:
- `loadCars()`: Loads and displays vehicles

**JSON Export/Import** - Lines 515-579:
- `exportData()`: Downloads trips + vehicles as JSON
- `importData(file, replace)`: Imports from JSON file
- Merge or replace option

**Image Drag & Drop** - Lines 581-596:
- Drag and drop support on preview
- File reading and preview

---

### js/pdf-export.js - PDF Export

**Role**: Generates PDF reports of trips.

**Initialization** - Lines 6-11:
- Attaches listener to export button

**Main Export** - Lines 13-77:
- `exportTripToPDF()`:
  - Checks html2pdf availability
  - Detects context (modal or result)
  - Collects trip data
  - Creates temporary off-screen container
  - Configures PDF options (A4, portrait)
  - Generates and downloads PDF
  - Cleans up temporary container

**Content Generation** - Lines 79-163:
- `generatePDFContent(data)`: Creates report HTML
- Sections: Header, Trip info, Driver, Costs, Remarks, Footer
- Inline styles for PDF compatibility

---

### js/smoke.js - Automated Tests

**Role**: Quick tests to verify proper functioning.

**Main Function** - Lines 4-86:
- `runSmokeTests()`: Executes all tests
- Tests performed:
  1. saveTrip creates id and date
  2. deleteTrip removes by id
  3. replaceTrips restores list
  4. Vehicle API (save/get/delete)
  5. loadHistory works
  6. export/import available

**Auto-execution** - Lines 89-95:
- Add `?runSmoke=1` to URL for automatic launch

---

## 🔄 Data Flow

### Recording a Trip

```
1. User opens index.html
   ↓
2. app.js requests geolocation
   ↓
3. Position obtained → reverseGeocode() → Display city
   ↓
4. User enters destination → Click "Démarrer"
   ↓
5. geocode(destination) → getRoute() → drawEstimatedRoute()
   ↓
6. watchPosition() starts GPS tracking
   ↓
7. updatePosition() on each movement
   ↓
8. Click "Arrêter" → Show form
   ↓
9. Click "Valider" → saveTrip() → localStorage
   ↓
10. Page reload
```

### Viewing Dashboard

```
1. User opens dashboard.html
   ↓
2. loadHistory() → getTrips() → Display list
   ↓
3. loadCars() → getCars() → Display vehicles
   ↓
4. updateSummary() → Calculate statistics
   ↓
5. Click on trip → openDetails() → Modal
   ↓
6. Click "Export PDF" → exportTripToPDF() → Download
```

---

## 🐛 Debugging Guide

### Browser Console

```javascript
// View all trips
console.log(getTrips());

// View all vehicles
console.log(getCars());

// Clear all data
localStorage.clear();

// Run tests
runSmokeTests();
```

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| GPS not working | Permission denied | Check browser settings |
| Empty map | No connection | Check internet |
| Blank PDF | Hidden element | Fixed (off-screen positioning) |
| Delete not working | confirmToast missing | Fixed (function declared) |
| Permanent toast | No mouseleave | Fixed (timer restarted) |

---

## 🔒 Security and Privacy

- ✅ All data stored locally (localStorage)
- ✅ No server communication
- ✅ No tracking or analytics
- ✅ Data stays on device
- ✅ GPS permission revocable in browser

---

## ⚠️ Known Limitations

1. **GPS Accuracy**: Depends on device hardware
2. **Storage**: localStorage limited to 5-10 MB
3. **Offline**: Geocoding and routing require internet
4. **Browsers**: Requires modern browser (Chrome, Firefox, Safari, Edge)

---

## 📝 Version History

- **v1.0.0** (January 2026): Initial release
- **v1.0.1** (January 2026): Bug fixes
  - Fixed confirmToast function declaration
  - Fixed toastContainerId constant
  - Fixed toast hover/leave behavior
  - Fixed PDF blank export issue
  - Added safe localStorage handling
  - Added keyboard accessibility for vehicle cards
  - Improved error handling for network requests

---

**Last Updated**: January 19, 2026
**Version**: 1.0.1
