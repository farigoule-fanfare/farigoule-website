# farigoule-vercel

## Required Environment Variables

You must set the following environment variables for the client and server. Copy `.env.template` on root to `.env` 

```
CLIENT_PORT=3000
SERVER_PORT=5000
FRONTEND_URL=http://localhost:3000
API_BACKEND_URL=http://server:5000
JWT_SECRET= see below
JWT_EXPIRY=1h
```

- `CLIENT_PORT`: Port for the React development server (default: 3000)
- `SERVER_PORT`: Port for the backend server (default: 5000)
- `FRONTEND_URL`: URL of the frontend app (for CORS)
- `API_BACKEND_URL`: Base URL for the backend API (for nginx.conf)
- `JWT_SECRET` : Token to securize authentication, you can generate it with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Changing it during a migration is OK; it just invalidates existing sessions.
- `JWT_EXPIRY` : Time before token expires. Can be 1h, 2h, 1d ...

> **Tip:** Never commit your `.env` files to version control. Both `client/.gitignore` and `server/.gitignore` should already exclude them.

# Docker
To start the containers, first do as above, then run :
```bash
docker compose up
```
The first time will take a bit longer since it will also build your containers.
If your container keep crashing, add the following line at the end of the corresponding service : `entrypoint: sleep infinity`.
This way, you can start your container and then run `docker exec -it <container_name> sh` the run an interactive shell in the container and run your app manually to debug.

# Prod
Pull the images from ghcr.io. You may use the docker-compose in the `prod` folder.
