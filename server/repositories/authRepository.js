const db = require('../services/databaseService');
const bcrypt = require('bcryptjs');

/** Utilitaire : transforme le champ JSON rôles en tableau */
function parseRoles(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const authRepository = {
     /* ---------- SELECT ---------- */
  findFanfaronById(id) {
    if (!id) return Promise.resolve(null);
    const sql = `
      SELECT id, surnom, nom, prenom, tel, email,
      json_extract(roles, '$') AS roles
      FROM fanfarons WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        row.roles = parseRoles(row.roles);
        resolve(row);
      });
    });
  },

  findFanfaronByEmail(email) {
    if (!email) return Promise.resolve(null);
    const sql = `SELECT id, surnom, nom, prenom, tel, email, password_hash,
                json_extract(roles,'$') AS roles
                FROM fanfarons WHERE email = ?`;
    return new Promise((resolve, reject) => {
      db.get(sql, [email], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        row.roles = parseRoles(row.roles);
        resolve(row);
      });
    });
  },

  findFanfaronBySurnom(surnom) {
    if (!surnom) return Promise.resolve(null);
    const sql = `SELECT id, surnom, nom, prenom, tel, email, password_hash,
                json_extract(roles,'$') AS roles
                FROM fanfarons WHERE surnom = ?`;
    return new Promise((resolve, reject) => {
      db.get(sql, [surnom], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        row.roles = parseRoles(row.roles);
        resolve(row);
      });
    });
  },

  comparePassword(plain, hash) {
    if (!plain || !hash) return Promise.resolve(false);
    return bcrypt.compare(plain, hash);
  },

  findPasswordHashById(userId) {
  const sql = 'SELECT password_hash FROM fanfarons WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.get(sql, [userId], (err, row) =>
      err ? reject(err) : resolve(row?.password_hash || null)
    );
  });
},

  updatePasswordById(userId, newHash) {
    if (!userId || !newHash) {
      return Promise.reject(new Error('userId et newHash requis'));
    }
    const sql = 'UPDATE fanfarons SET password_hash = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [newHash, userId], err => (err ? reject(err) : resolve()));
    });
  },
}

module.exports = authRepository;