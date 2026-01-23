# Farigoule Client

Interface utilisateur pour le site Farigoule, construite avec React et Vite.

## Installation

```bash
npm install
```

## Scripts disponibles

### `npm start`

Lance l'application en mode développement avec Vite.\
Ouvrir [http://localhost:3000](http://localhost:3000) pour la voir dans le navigateur.

La page se recharge automatiquement lors des modifications.\
Temps de démarrage ultra-rapide grâce à Vite.

### `npm run build`

Construit l'application pour la production dans le dossier `build`.\
Optimise le build pour les meilleures performances.

Le build est minifié et les noms de fichiers incluent des hashes.\
L'application est prête à être déployée !

### `npm run serve`

Prévisualise le build de production localement.\
Utile pour tester le build avant le déploiement.

## Configuration

### Alias de chemins

Les alias suivants sont configurés dans `vite.config.js` :

- `@` → `src/`
- `@assets` → `src/assets/`
- `@features` → `src/features/`
- `@shell` → `src/shell/`
- `@services` → `src/services/`
- `@shared` → `src/shared/`

**Exemple d'utilisation :**

```javascript
import Button from "@shared/components/Button";
import logo from "@assets/images/logo.png";
```

### Proxy API

Le serveur de développement proxy automatiquement les requêtes :

- `/api/*` → Backend server
- `/public/*` → Fichiers statiques du backend

Configuration dans `vite.config.js`.

### Variables d'environnement

Les variables d'environnement doivent être préfixées par `VITE_` :

```env
VITE_API_URL=http://localhost:5000
```

**Utilisation :**

```javascript
const apiUrl = import.meta.env.VITE_API_URL;
```

## Technologies

- **React 18** - Library UI
- **Vite 5** - Build tool & dev server
- **React Router 6** - Routing
- **Axios** - HTTP client
- **Slick Carousel** - Composant carrousel

## Structure du projet

```
src/
├── assets/          # Images, fonts, audio
├── features/        # Features organisées par domaine
│   ├── admin/       # Interface admin
│   ├── annuaire/    # Annuaire des fanfarons
│   ├── auth/        # Authentification
│   ├── profile/     # Profil utilisateur
│   └── public/      # Pages publiques
├── services/        # Services API (axios)
├── shared/          # Composants réutilisables
├── shell/           # Layout et navigation
│   ├── components/  # Header, Footer, etc.
│   ├── hooks/       # Hooks personnalisés
│   └── layouts/     # Layout templates
└── index.jsx        # Point d'entrée
```

## En savoir plus

- [Documentation Vite](https://vitejs.dev/)
- [Documentation React](https://react.dev/)
- [Documentation React Router](https://reactrouter.com/)
