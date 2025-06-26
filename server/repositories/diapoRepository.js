// repositories/diapoRepository.js
const db = require('../services/databaseService');

const diapoRepository = {
  /** Dernières diapos (par défaut : 5) */
  findLatest(limit = 5) {
    const sql = `
      SELECT id, fichier, description, created_at
      FROM diapos
      ORDER BY id DESC
      LIMIT ?
    `;
    return new Promise((resolve, reject) =>
      db.all(sql, [limit], (err, rows) => (err ? reject(err) : resolve(rows)))
    );
  },

  /** Une diapo aléatoire */
  findRandom() {
    const sql = `
      SELECT id, fichier, description, created_at
      FROM diapos
      ORDER BY RANDOM()
      LIMIT 1
    `;
    return new Promise((resolve, reject) =>
      db.get(sql, [], (err, row) => (err ? reject(err) : resolve(row || null)))
    );
  },

  /** Toutes les diapos */
  findAll() {
    const sql = `
      SELECT id, fichier, description, created_at
      FROM diapos
      ORDER BY id DESC
    `;
    return new Promise((resolve, reject) =>
      db.all(sql, [], (err, rows) => (err ? reject(err) : resolve(rows)))
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
