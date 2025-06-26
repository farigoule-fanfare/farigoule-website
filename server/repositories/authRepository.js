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

  findFanfaronByEmail(email) {
    if (!email) return Promise.resolve(null);
    const sql = 'SELECT * FROM fanfarons WHERE email = ?';
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
    const sql = 'SELECT * FROM fanfarons WHERE surnom = ?';
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
};

module.exports = authRepository;