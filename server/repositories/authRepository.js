const db = require('../services/databaseService');

/** Utilitaire : transforme le champ JSON rôles en tableau */
function parseRoles(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
const ALLOWED_FIELDS = new Set(['id', 'email', 'surnom']); /* Champs autorisés pour filtrer – évite les injections SQL           */
const authRepository = {

  /**
   * Trouve un fanfaron selon un filtre { field, value }.
   * @param {{ field: string, value: string|number }} filter
   * @returns {Promise<object|null>}
   */
      findFanfaronBy({ field, value }) {
    if (!field || value == null) return Promise.resolve(null);
    if (!ALLOWED_FIELDS.has(field))
      return Promise.reject(new Error(`Champ '${field}' non autorisé`));

    const sql = `
      SELECT id, surnom, nom, prenom, tel, email, roles, password_hash
      FROM fanfarons
      WHERE ${field} = ?
      LIMIT 1
    `;

    return new Promise((resolve, reject) => {
      db.get(sql, [value], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        row.roles = parseRoles(row.roles);
        resolve(row);
      });
    });
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