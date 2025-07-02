const path = require('path');
const Database = require('better-sqlite3');

// Emplacement du fichier SQLite (../database/farigoule.sqlite)
const DB_PATH = path.resolve(__dirname, '..', 'database', 'farigoule.sqlite');

// Ouvre (ou crée) la base avec un timeout de 3 s pour les verrous concurrents
const db = new Database(DB_PATH, { timeout: 3000 });

/* ------------------------------------------------------------------ */
/*  Schéma : exécuté une seule fois au démarrage                      */
/* ------------------------------------------------------------------ */
db.exec(`
  /* ----------- fanfarons -------------------------------------------------- */
  CREATE TABLE IF NOT EXISTS fanfarons (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    surnom        TEXT UNIQUE NOT NULL,
    prenom        TEXT,
    nom           TEXT,
    instrument    TEXT,
    promo         INTEGER,
    bureau        TEXT,
    tel           TEXT,
    email         TEXT UNIQUE,
    photo         TEXT,
    description   TEXT,
    password_hash TEXT,
    roles         TEXT NOT NULL DEFAULT '["fanfaron"]'
  );

  /* ----------- citations -------------------------------------------------- */
  CREATE TABLE IF NOT EXISTS citations (
    id        INTEGER PRIMARY KEY AUTOINCREMENT,
    citation  TEXT NOT NULL,
    auteur_id INTEGER REFERENCES fanfarons(id) ON DELETE SET NULL
  );

  /* ----------- diapos (carousel) ----------------------------------------- */
  CREATE TABLE IF NOT EXISTS diapos (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    fichier     TEXT NOT NULL,
    description TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  /* ----------- contrats (événements) ------------------------------------- */
  CREATE TABLE IF NOT EXISTS contrats (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    date        DATE NOT NULL,
    lieu        TEXT,
    description TEXT,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log(`SQLite initialisé : ${DB_PATH}`);

/* ------------------------------------------------------------------ */
/*  Fermeture propre (SIGINT / SIGTERM)                                */
/* ------------------------------------------------------------------ */
process.on('SIGTERM', () => db.close());
process.on('SIGINT',  () => db.close());

module.exports = db;        // Import direct : const db = require('../services/databaseService');
