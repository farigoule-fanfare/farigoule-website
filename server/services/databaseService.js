// services/databaseService.js
const path = require('path');
const Database = require('better-sqlite3');

const DB_PATH = path.resolve(__dirname, '..', 'database', 'farigoule.sqlite');
const dbNative = new Database(DB_PATH, { timeout: 3000 });

/* ------------------------------------------------------------------ */
/*  Wrapper rétro-compatibilité sqlite3 : get / all / run (callbacks)  */
/* ------------------------------------------------------------------ */
function wrap(method) {
  /* method = (sql, params) => résultat synchrone */
  return (sql, params = [], cb = () => {}) => {
    try {
      const res = method(sql, params);
      /* on répond de façon asynchrone comme avant */
      setImmediate(() => cb(null, res));
    } catch (err) {
      setImmediate(() => cb(err));
    }
  };
}

const db = {
  /* API « sqlite3 » ------------------------------- */
  get : wrap((sql, p) => dbNative.prepare(sql).get(p)),
  all : wrap((sql, p) => dbNative.prepare(sql).all(p)),
  run : wrap((sql, p) => dbNative.prepare(sql).run(p)),
  /* API native better-sqlite3 --------------------- */
  prepare : (...a) => dbNative.prepare(...a),
  exec    : (...a) => dbNative.exec(...a),
  /* on expose la connexion brute si besoin */
  _native : dbNative,
};

/* ------------------------------------------------------------------ */
/*  DDL (table roles JSON par défaut)                                  */
/* ------------------------------------------------------------------ */
db.exec(`
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
  /* … autres tables … */
`);

console.log('SQLite schema ready (better-sqlite3, wrapper sqlite3).');
module.exports = db;
