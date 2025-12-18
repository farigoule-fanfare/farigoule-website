# Farigoule Server

API backend pour le site Farigoule, construit avec Express.js et SQLite3.

## Installation

```bash
npm install
```

## Démarrage

### Development

```bash
npm start
```

### Tests

```bash
npm test
```

## Architecture

- **Controllers** : Logique métier
- **Services** : Services applicatifs
- **Repositories** : Accès aux données
- **Middleware** : Authentification et autorisations
- **Routes** : Points d'entrée des endpoints

## API Endpoints

### Authentication (`/api/auth`)

| Méthode | Endpoint                       | Description                           | Auth | Role  |
| ------- | ------------------------------ | ------------------------------------- | ---- | ----- |
| POST    | `/api/auth/login`              | Se connecter                          | ❌   | -     |
| POST    | `/api/auth/logout`             | Se déconnecter                        | ✅   | -     |
| GET     | `/api/auth/status`             | Vérifier le statut d'authentification | ✅   | -     |
| PUT     | `/api/auth/change-password`    | Changer son mot de passe              | ✅   | -     |
| POST    | `/api/auth/admin-set-password` | Définir un mot de passe (admin)       | ✅   | admin |

### Citations (`/api/citations`)

| Méthode | Endpoint                 | Description                             | Auth | Role  |
| ------- | ------------------------ | --------------------------------------- | ---- | ----- |
| GET     | `/api/citations/`        | Obtenir une citation aléatoire          | ❌   | -     |
| GET     | `/api/citations/ordered` | Lister toutes les citations (ordonnées) | ✅   | admin |
| POST    | `/api/citations/`        | Ajouter une citation                    | ✅   | admin |
| PUT     | `/api/citations/:id`     | Modifier une citation                   | ✅   | admin |
| DELETE  | `/api/citations/:id`     | Supprimer une citation                  | ✅   | admin |

### Contrats (`/api/contrats`)

| Méthode | Endpoint                 | Description                 | Auth | Role  | Paramètres                                                                        |
| ------- | ------------------------ | --------------------------- | ---- | ----- | --------------------------------------------------------------------------------- |
| GET     | `/api/contrats/`         | Lister tous les contrats    | ✅   | admin | `?scope=upcoming\|past&since=YYYY-MM-DD&until=YYYY-MM-DD&order=asc\|desc&limit=N` |
| GET     | `/api/contrats/upcoming` | Lister les contrats à venir | ❌   | -     | -                                                                                 |
| GET     | `/api/contrats/past`     | Lister les contrats passés  | ❌   | -     | -                                                                                 |
| POST    | `/api/contrats/`         | Ajouter un contrat          | ✅   | admin | `{date: "YYYY-MM-DD", ...}`                                                       |
| PUT     | `/api/contrats/:id`      | Modifier un contrat         | ✅   | admin | `{date: "YYYY-MM-DD", ...}`                                                       |
| DELETE  | `/api/contrats/:id`      | Supprimer un contrat        | ✅   | admin | -                                                                                 |

### Diapos (Carousel) (`/api/diapos`)

| Méthode | Endpoint              | Description                        | Auth | Role  | Paramètres                         |
| ------- | --------------------- | ---------------------------------- | ---- | ----- | ---------------------------------- |
| GET     | `/api/diapos/`        | Lister les diapos (publique)       | ❌   | -     | `?order=random\|asc\|desc&limit=N` |
| GET     | `/api/diapos/ordered` | Lister toutes les diapos (admin)   | ✅   | admin | -                                  |
| POST    | `/api/diapos/`        | Ajouter une diapo (upload fichier) | ✅   | admin | multipart/form-data: `file`        |
| PUT     | `/api/diapos/:id`     | Modifier une diapo                 | ✅   | admin | multipart/form-data: `file`        |
| DELETE  | `/api/diapos/:id`     | Supprimer une diapo                | ✅   | admin | -                                  |

### Fanfarons (`/api/fanfarons`)

| Méthode | Endpoint                  | Description                     | Auth | Role  | Paramètres                           |
| ------- | ------------------------- | ------------------------------- | ---- | ----- | ------------------------------------ |
| GET     | `/api/fanfarons/`         | Lister tous les fanfarons       | ❌   | -     | -                                    |
| GET     | `/api/fanfarons/annuaire` | Lister les fanfarons (annuaire) | ✅   | -     | -                                    |
| POST    | `/api/fanfarons/`         | Ajouter un fanfaron             | ✅   | admin | multipart/form-data: `photoFanfaron` |
| PUT     | `/api/fanfarons/:id`      | Modifier un fanfaron            | ✅   | admin | multipart/form-data: `photoFanfaron` |
| DELETE  | `/api/fanfarons/:id`      | Supprimer un fanfaron           | ✅   | admin | -                                    |

### Utilisateurs (`/api/users`)

| Méthode | Endpoint                         | Description                       | Auth | Role  |
| ------- | -------------------------------- | --------------------------------- | ---- | ----- |
| GET     | `/api/users/current-president`   | Obtenir le président actuel       | ❌   | -     |
| PUT     | `/api/users/profile`             | Mettre à jour son profil          | ✅   | -     |
| GET     | `/api/users/roles`               | Lister les rôles des utilisateurs | ✅   | admin |
| POST    | `/api/users/:id/addAdminRole`    | Ajouter le rôle admin             | ✅   | admin |
| POST    | `/api/users/:id/removeAdminRole` | Retirer le rôle admin             | ✅   | admin |

### Sitemap (`/sitemap.xml`)

| Méthode | Endpoint       | Description            | Auth |
| ------- | -------------- | ---------------------- | ---- |
| GET     | `/sitemap.xml` | Obtenir le sitemap XML | ❌   |

## Authentification

L'API utilise un système de tokens JWT pour l'authentification.

- **Endpoints publics** : Pas de token requis
- **Endpoints protégés** : Token JWT requis dans le header `Authorization: Bearer <token>`
- **Endpoints admin** : Token JWT + rôle `admin` requis

## Filtres et Paramètres

### Contrats - Scope

- `upcoming` : Contrats futurs (date >= aujourd'hui)
- `past` : Contrats passés (date < aujourd'hui)

### Diapos - Ordre

- `random` : Ordre aléatoire (défaut)
- `asc` : Ordre croissant
- `desc` : Ordre décroissant

## Uploads de fichiers

Les endpoints suivants acceptent des uploads de fichiers :

- `POST /api/diapos/` - Carousel image
- `PUT /api/diapos/:id` - Update carousel image
- `POST /api/fanfarons/` - Fanfaron photo
- `PUT /api/fanfarons/:id` - Update fanfaron photo

Format : `multipart/form-data`

Les fichiers sont stockés dans :

- Diapos : `public/uploads/carousel/`
- Fanfarons : `public/uploads/fanfarons/`

## Middleware

### Authentication Middleware

- `protect` : Vérifie la validité du JWT
- `authorize(['admin'])` : Vérifie que l'utilisateur a le rôle requis

## Variables d'environnement

Voir `.env` pour la configuration (non versionné).

## Tests

```bash
npm test
```

Coverage pour les services : 100% statements, 96.77% branches
