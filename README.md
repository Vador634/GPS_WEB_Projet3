# Wipsee Mobile GPS

Application web de **suivi de trajets professionnels** : enregistrement GPS en temps réel, itinéraire estimé, gestion des véhicules, péages, historique, statistiques et **rapport PDF**.

Tout fonctionne dans le navigateur, sans serveur ni base de données : les données sont stockées en local (`localStorage`).

> Projet n°3 du BTS SIO option SLAM — HTML, CSS et JavaScript, sans framework.

---

## Fonctionnalités

**Enregistrement d'un trajet** (`index.html`)
- Position de départ obtenue par **géolocalisation**, puis convertie en nom de ville (Nominatim).
- Itinéraire estimé tracé en bleu (OSRM), trajet réel tracé en rouge au fil du déplacement.
- Filtrage des points GPS imprécis (plus de 100 m de précision) et du « bruit » à l'arrêt.
- **Mode simulation** si le GPS est refusé ou indisponible : on saisit une ville de départ et le trajet suit l'itinéraire estimé (en environ 30 secondes).
- Récapitulatif : distance, durée, heures de départ et d'arrivée, péages, conducteur, véhicule, remarque.

**Tableau de bord** (`dashboard.html`)
- Historique des trajets, du plus récent au plus ancien, avec suppression et **annulation**.
- Détail d'un trajet : carte du parcours réel et estimé, modification du péage.
- **Export PDF** : rapport imprimable avec carte, conducteur, véhicule et frais.
- Gestion des **véhicules** : nom, description, photo (fichier, URL ou glisser-déposer, redimensionnée automatiquement).
- Statistiques du mois ou de l'année : kilomètres parcourus et dépenses de péage.
- **Export / import JSON** de toutes les données (fusion ou remplacement).

## Technologies

| Rôle | Outil |
|---|---|
| Carte | [Leaflet](https://leafletjs.com/) 1.9 et tuiles OpenStreetMap |
| Géocodage | API Nominatim (OpenStreetMap) |
| Itinéraire | API OSRM |
| Capture de la carte pour le PDF | html2canvas |
| Stockage | `localStorage` du navigateur |

## Lancer le projet

La géolocalisation n'est autorisée par les navigateurs que sur `https://` ou `localhost`. Il faut donc servir le dossier avec un petit serveur local :

```bash
git clone https://github.com/Vador634/GPS_WEB_Projet3.git
cd GPS_WEB_Projet3
python -m http.server 8000
```

Puis ouvrir `http://localhost:8000`. L'extension **Live Server** de VS Code fonctionne aussi.

Sur téléphone, l'application peut être hébergée telle quelle sur GitHub Pages (HTTPS).

## Utilisation

1. Autoriser la localisation (ou saisir une ville de départ en mode simulation).
2. Saisir la ville d'arrivée puis cliquer sur **Démarrer**.
3. Cliquer sur **Arrêter** à l'arrivée, compléter le conducteur, le péage et le véhicule, puis **Valider le trajet**.
4. Ouvrir le **dashboard** pour consulter l'historique, les statistiques ou exporter un trajet en PDF.

## Structure

```
├── index.html          Enregistrement d'un trajet
├── dashboard.html      Historique, véhicules, statistiques
├── css/style.css       Styles (responsive mobile)
├── img/voiture.svg     Image par défaut des véhicules
└── js/
    ├── app.js          GPS, carte, simulation, enregistrement
    ├── dashboard.js    Historique, véhicules, statistiques, import/export
    ├── pdf-export.js   Rapport PDF imprimable
    ├── storage.js      Lecture / écriture dans le localStorage
    ├── ui.js           Notifications et confirmations
    └── smoke.js        Tests rapides
```

## Tests

Des tests rapides vérifient le stockage (trajets, véhicules, suppression, association véhicule/péage) et l'affichage de l'historique.
Ouvrir `dashboard.html?runSmoke=1` puis regarder la console du navigateur.

## Sécurité et données

- Aucune donnée n'est envoyée à un serveur : trajets et véhicules restent dans le navigateur.
- Les textes saisis (noms, remarques, véhicules) sont affichés comme du texte et échappés dans le rapport PDF ; seules les images `http(s)` ou `data:image` sont acceptées.
- Seules les coordonnées de départ et les villes saisies sont transmises aux services publics Nominatim et OSRM.

## Auteur

**Kilian Carasco** — étudiant en Bachelor Concepteur Développeur d'Applications (EPSI Bordeaux)
[GitHub](https://github.com/Vador634) · [LinkedIn](https://www.linkedin.com/in/kilian-carasco-029915399/)
