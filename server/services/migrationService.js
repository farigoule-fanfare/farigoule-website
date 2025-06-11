const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const { Buffer } = require('buffer');
const bcrypt = require('bcryptjs');

// ------------------------------------------------------------
// 1) Open or create the SQLite database (enable foreign keys)
// ------------------------------------------------------------
const dbFile = path.resolve(__dirname, '..', 'database', 'farigoule.sqlite');
const dbDir  = path.dirname(dbFile);
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });

const db = new sqlite3.Database(
  dbFile,
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  err => {
    if (err) {
      console.error('Could not open database:', err.message);
      process.exit(1);
    }
    db.run('PRAGMA foreign_keys = ON');
    console.log(`Connected to SQLite database at ${dbFile}`);
    migrateData().catch(error => {
      console.error('Migration failed:', error);
      db.close();
    });
  }
);

// ------------------------------------------------------------
// 2) Paths to the exported JSON files
// ------------------------------------------------------------
const fanfaronsFilePath = path.resolve(__dirname, '../../db_migration_project/fanfarons_export.json');
const citationsFilePath = path.resolve(__dirname, '../../db_migration_project/citations_export.json');
const diaposFilePath    = path.resolve(__dirname, '../../db_migration_project/diapos_export.json');
const contratsFilePath  = path.resolve(__dirname, '../../db_migration_project/contrats_export.json');

// ------------------------------------------------------------
// 3) Utility helpers
// ------------------------------------------------------------
function cleanAndFixEncoding(text) {
  if (typeof text !== 'string') return '';
  let s = text.replace(/&nbsp;/g, ' ')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&quot;/g, '"')
              .replace(/&apos;/g, "'")
              .trim();
  s = s.replace(/<br\s*\/?>(\s*|)/gi, '\n');
  try {
    if (/[ÂÃ][\x80-\xBF]/.test(s)) {
      const buf = Buffer.from(s, 'latin1');
      const ut8 = buf.toString('utf8');
      if (ut8 !== s) s = ut8;
    }
  } catch {}
  return s.replace(/\n+/g, '\n').trim();
}

function formatDateToSql(dateString) {
  if (!dateString) return null;
  const [d] = dateString.split(' ');
  const dt = new Date(d);
  return isNaN(dt.getTime()) ? null : dt.toISOString().slice(0, 10);
}

// ------------------------------------------------------------
// 4) Migration logic
// ------------------------------------------------------------
async function migrateData() {
  console.log('Starting migration...');

  // Read JSON exports
  const fanfarons = JSON.parse(fs.readFileSync(fanfaronsFilePath, 'utf8'));
  const citations = JSON.parse(fs.readFileSync(citationsFilePath, 'utf8'));
  const diapos    = JSON.parse(fs.readFileSync(diaposFilePath, 'utf8'));
  const contrats  = JSON.parse(fs.readFileSync(contratsFilePath, 'utf8'));

  // 4.1 Create tables if missing, including created_at for diapos
  await new Promise((res, rej) => {
    db.exec(
      `CREATE TABLE IF NOT EXISTS fanfarons (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         surnom TEXT UNIQUE,
         instrument TEXT,
         promo INTEGER,
         bureau TEXT,
         tel TEXT,
         email TEXT UNIQUE,
         photo TEXT,
         description TEXT,
         password_hash TEXT,
         roles TEXT,
         prenom TEXT,
         nom TEXT
       );
       CREATE TABLE IF NOT EXISTS citations (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         citation TEXT,
         auteur_id INTEGER,
         FOREIGN KEY(auteur_id) REFERENCES fanfarons(id)
       );
       CREATE TABLE IF NOT EXISTS diapos (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         fichier TEXT,
         description TEXT,
         created_at TEXT DEFAULT (datetime('now'))
       );
       CREATE TABLE IF NOT EXISTS contrats (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         date TEXT,
         lieu TEXT,
         description TEXT
       );`,
      err => err ? rej(err) : res()
    );
  });
  console.log('Tables ensured.');

  // 4.2 Begin transaction
  await new Promise((r, e) => db.run('BEGIN', err => err ? e(err) : r()));

  try {
    // 4.3 Clear old data
    for (const t of ['citations', 'diapos', 'contrats', 'fanfarons']) {
      await new Promise((r, e) => db.run(`DELETE FROM ${t}`, err => err ? e(err) : r()));
    }

    // 4.4 Insert fanfarons
    const mapIds = new Map();
    const usedEmails = new Set();
    const stmtF = db.prepare(
      `INSERT INTO fanfarons
         (surnom, instrument, promo, bureau, tel, email, photo, description, password_hash, roles, prenom, nom)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, '["fanfaron"]', NULL, NULL)`
    );
    for (const f of fanfarons) {
      const promo = f.promo ? +f.promo : null;
      let email = (f.mail || '').trim() || `user${f.idFanfaron}@local`;
      if (usedEmails.has(email)) email = `user${f.idFanfaron}@local`;
      usedEmails.add(email);

      await new Promise((r, e) => stmtF.run(
        cleanAndFixEncoding(f.surnom),
        cleanAndFixEncoding(f.instrument),
        promo,
        cleanAndFixEncoding(f.bureau),
        f.tel,
        email,
        f.photo,
        cleanAndFixEncoding(f.description),
        function(err) {
          if (err) return e(err);
          mapIds.set(f.idFanfaron, this.lastID);
          r();
        }
      ));
    }
    await new Promise((r, e) => stmtF.finalize(err => err ? e(err) : r()));
    console.log(`Inserted ${mapIds.size} fanfarons.`);

    // 4.5 Insert temporary admin fanfaron
    const tempAdminHash = bcrypt.hashSync('Fari13', 10);
    await new Promise((resolve, reject) => {
    db.run(
        `INSERT INTO fanfarons (surnom, instrument, promo, bureau, tel, email, photo, description, password_hash, roles) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
        'tempadmin',           // surnom
        '',                    // instrument
        2050,                  // promo
        '',                    // bureau
        '',                    // tel
        'tempadmin@local',     // email
        '',                    // photo
        'Temporary admin user',// description
        tempAdminHash,         // password_hash
        '["fanfaron","admin"]' // roles
        ],
        err => err ? reject(err) : resolve()
    );
    });
    console.log('Inserted temporary admin fanfaron with password Fari13.');

    // 4.6 Insert citations
    const stmtC = db.prepare('INSERT INTO citations(citation,auteur_id) VALUES(?,?)');
    let citationCount = 0;
    for (const c of citations) {
      const id = mapIds.get(c.idFanfaron);
      if (!id) continue;
      await new Promise((r, e) => stmtC.run(cleanAndFixEncoding(c.citation), id, err => err ? e(err) : r()));
      citationCount++;
    }
    await new Promise((r, e) => stmtC.finalize(err => err ? e(err) : r()));
    console.log(`Inserted ${citationCount} citations.`);

    // 4.7 Insert diapos with created_at default
    const diapoStmt = db.prepare('INSERT INTO diapos (fichier, description) VALUES (?, ?)');
    let insertedDiapos = 0;
    for (const d of diapos) {
      const desc = cleanAndFixEncoding(d.description);
      if (!d.fichier) {
        console.warn(`Skipping diapo with missing fichier: ${JSON.stringify(d)}`);
        continue;
      }
      await new Promise((r, e) => diapoStmt.run(d.fichier, desc, err => err ? e(err) : r()));
      insertedDiapos++;
    }
    await new Promise((r, e) => diapoStmt.finalize(err => err ? e(err) : r()));
    console.log(`Inserted ${insertedDiapos} diapos.`);

    // 4.8 Insert contrats
    const stmtT = db.prepare('INSERT INTO contrats(date,lieu,description) VALUES(?,?,?)');
    let contratCount = 0;
    for (const ct of contrats) {
      const dt = formatDateToSql(ct.date);
      if (!dt) continue;
      await new Promise((r, e) => stmtT.run(dt, cleanAndFixEncoding(ct.lieu), cleanAndFixEncoding(ct.description), err => err ? e(err) : r()));
      contratCount++;
    }
    await new Promise((r, e) => stmtT.finalize(err => err ? e(err) : r()));
    console.log(`Inserted ${contratCount} contrats.`);

    // 4.9 Commit
    await new Promise((r, e) => db.run('COMMIT', err => err ? e(err) : r()));
    console.log('✅ Migration completed successfully.');
  } catch (err) {
    console.error('Error during migration, rolling back:', err);
    await new Promise(r => db.run('ROLLBACK', () => r()));
  } finally {
    db.close();
  }
}
