# SESAME — Administration des réclamations

Interface React + Vite inspirée de la maquette fournie.

## 1. Prérequis
- Installer Node.js (version LTS) : https://nodejs.org/
- Installer Visual Studio Code.

## 2. Lancer le projet
Ouvrez le dossier `sesame-admin` dans VS Code, puis ouvrez le terminal intégré (**Terminal > Nouveau terminal**).

Exécutez les commandes une par une :

```bash
npm install
npm run dev
```

Vite affichera une adresse, généralement `http://localhost:5173/`. Ouvrez cette adresse dans votre navigateur.

Pour arrêter le serveur : `Ctrl + C` dans le terminal.

## 3. Fonctionnalités déjà présentes
- Tableau de bord avec indicateurs calculés à partir des données.
- Liste de réclamations avec recherche et filtres (statut, catégorie, période).
- Consultation du détail, modification et changement de statut.
- Création de réclamation.
- Historique des réclamations résolues/fermées.
- Graphique de répartition par statut.
- Liste des étudiants qui ont envoyé une réclamation.
- Export CSV et réinitialisation des données de démonstration.
- Enregistrement local dans le navigateur avec `localStorage`.
- Mise en page adaptée aux écrans mobiles.

## 4. Où modifier le projet ?
- `src/App.jsx` : composants React, données de démonstration et actions.
- `src/styles.css` : couleurs, dimensions et responsive design.
- `src/main.jsx` : point d'entrée React.
- `package.json` : dépendances et commandes.

## 5. Préparer la future base de données
Pour le moment, aucune vraie base de données n'est connectée : `localStorage` conserve les changements dans ce navigateur uniquement. Les données de départ sont des exemples.

Quand le backend sera prêt, créez par exemple une API REST (PHP ou Node.js) et remplacez les fonctions de lecture/écriture locale par des appels `fetch()` vers cette API. La base (par exemple MySQL) doit être utilisée côté serveur, jamais directement depuis React. Ajoutez une authentification et des droits administrateur avant d'utiliser des données réelles.

## 6. Construire pour la production
```bash
npm run build
npm run preview
```
