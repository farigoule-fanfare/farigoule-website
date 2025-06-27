// repositories/diapoRepository.js
const db = require('../services/databaseService');

const diapoRepository = {
  
  /** Récupération des diapos */
  find({ order = 'desc', limit } = {}) {
    const params = [];
    const orderClause =
      order === 'random' ? 'ORDER BY RANDOM()'
      : `ORDER BY id ${order.toUpperCase()}`;

    const limitClause = limit ? 'LIMIT ?' : '';
    if (limit) params.push(limit);

    const sql = `
      SELECT id, fichier, description, created_at
      FROM diapos
      ${orderClause}
      ${limitClause}
    `;
    return new Promise((resolve, reject) =>
      db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
    );
  },

  /** Insertion */
  create({ fichier, description }) {
    const sql = `
      INSERT INTO diapos (fichier, description, created_at)
      VALUES (?, ?, datetime('now'))
    `;
    return new Promise((resolve, reject) =>
      db.run(sql, [fichier, description], function (err) {
        if (err) return reject(err);
        resolve({
          id: this.lastID,
          fichier,
          description,
          created_at: new Date().toISOString(),
        });
      })
    );
  },

  /** Mise à jour (ne modifie que les champs fournis) */
  update(id, { fichier, description }) {
    const sql = `
      UPDATE diapos
      SET fichier = COALESCE(?, fichier),
          description = COALESCE(?, description)
      WHERE id = ?
    `;
    return new Promise((resolve, reject) =>
      db.run(sql, [fichier, description, id], function (err) {
        if (err) return reject(err);
        resolve({ id, fichier, description, changes: this.changes });
      })
    );
  },

  /** Suppression */
  remove(id) {
    const sql = `DELETE FROM diapos WHERE id = ?`;
    return new Promise((resolve, reject) =>
      db.run(sql, [id], function (err) {
        if (err) return reject(err);
        resolve({ deleted: this.changes });
      })
    );
  },
};

module.exports = diapoRepository;
