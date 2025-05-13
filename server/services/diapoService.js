const db = require('../database');

const diapoService = {
  /**
   * Fetches the latest diapos (carousel slides).
   * @param {number} [limit=5]
   */
  getLatestDiapos: (limit = 5) => new Promise((resolve, reject) => {
    const sql = `SELECT id, fichier, description, created_at FROM diapos ORDER BY id DESC LIMIT ?`;
    db.all(sql, [limit], (err, rows) => err ? reject(err) : resolve(rows));
  }),

  /**
   * Fetches a single random diapo.
   */
  getRandomDiapo: () => new Promise((resolve, reject) => {
    const sql = `SELECT id, fichier, description, created_at FROM diapos ORDER BY RANDOM() LIMIT 1`;
    db.get(sql, [], (err, row) => err ? reject(err) : resolve(row || null));
  }),

  /**
   * Fetches all diapos.
   */
  getAllDiapos: () => new Promise((resolve, reject) => {
    const sql = `SELECT id, fichier, description, created_at FROM diapos ORDER BY id DESC`;
    db.all(sql, [], (err, rows) => err ? reject(err) : resolve(rows));
  }),

  /**
   * Adds a new diapo.
   */
  addDiapo: ({ fichier, description }) => new Promise((resolve, reject) => {
    const sql = `INSERT INTO diapos (fichier, description, created_at) VALUES (?, ?, datetime('now'))`;
    db.run(sql, [fichier, description], function(err) {
      err ? reject(err) : resolve({ id: this.lastID, fichier, description, created_at: new Date().toISOString() });
    });
  }),

  /**
   * Updates an existing diapo by ID.
   */
  updateDiapo: (id, { fichier, description }) => new Promise((resolve, reject) => {
    const sql = `UPDATE diapos SET fichier = COALESCE(?, fichier), description = COALESCE(?, description) WHERE id = ?`;
    db.run(sql, [fichier, description, id], function(err) {
      err ? reject(err) : resolve({ id, fichier, description, changes: this.changes });
    });
  }),

  /**
   * Deletes a diapo by ID.
   */
  deleteDiapo: (id) => new Promise((resolve, reject) => {
    const sql = `DELETE FROM diapos WHERE id = ?`;
    db.run(sql, [id], function(err) {
      err ? reject(err) : resolve({ deleted: this.changes });
    });
  })
};

module.exports = diapoService;
