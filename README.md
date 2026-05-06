# farigoule-website

## Variables d’environnement requises

Vous devez définir les variables d’environnement pour le client et le serveur. Copiez `.env.template` à la racine vers `.env`.

    CLIENT_PORT=3000
    SERVER_PORT=5000
    FRONTEND_URL=http://localhost:3000
    API_BACKEND_URL=http://server:5000
    JWT_SECRET= voir ci-dessous

- `CLIENT_PORT` : Port pour le serveur React en développement (défaut : 3000)
- `SERVER_PORT` : Port pour le serveur backend (défaut : 5000)
- `FRONTEND_URL` : URL du frontend (pour le CORS)
- `API_BACKEND_URL` : URL de base de l’API backend (pour nginx.conf)
- `JWT_SECRET` : Secret pour sécuriser l’authentification. Vous pouvez le générer avec `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Le changer pendant une migration n’est pas grave : ça invalide simplement les sessions existantes.

> **Astuce :** Ne committez jamais vos fichiers `.env`. Les `.gitignore` de `client` et `server` doivent déjà les exclure.
> 
> **Note :** en développement, le serveur et le client charge automatiquement le `.env` à la racine. En production, les variables doivent être fournies par Docker/Compose (le `.env` a la racine n’est pas lu).

## Production (Docker)

La production utilise le `docker-compose.yml` à la racine et le fichier `.env` (copiez `.env.template` vers `.env`).

### Déploiement

    cp .env.template .env
    docker compose pull
    docker compose up -d

### Nom de domaine / DNS

Le nom de domaine est chez Gandi, qui sert aussi de name server. Un enregistrement DNS A pointe actuellement vers l’IP publique de **Bor**. À terme, il pointera vers **Tyr**, le nouveau serveur du Ginfo.

### Mise à jour

    docker compose pull
    docker compose up -d

### Dépannage

Si un conteneur crash en boucle, ajoutez la ligne suivante à la fin du service concerné : `entrypoint: sleep infinity`.
Vous pourrez ensuite faire `docker exec -it <container_name> sh` pour ouvrir un shell et lancer l’app manuellement.

## Développement (Local)

Lancez les apps sans Docker en démarrant chaque dossier :

    cd client
    npm run start

Dans un autre terminal :

    cd server
    npm run start

## Stack technique

- Frontend : React 18 + Vite, React Router, Axios
- Backend : Node.js + Express, SQLite (better-sqlite3), JWT, Multer
- Infrastructure : Docker & Docker Compose (images GHCR)
