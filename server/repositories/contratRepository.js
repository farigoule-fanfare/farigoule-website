const db = require('../services/databaseService');

// Helper : YYYY-MM-DD (fuseau du serveur)
function todayIso() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

const contratRepository = {
  /** Tous les contrats, du plus récent au plus ancien */
  findAll() {
    const sql = `
      SELECT id, date, lieu, description
      FROM contrats
      ORDER BY date DESC
    `;
    return new Promise((resolve, reject) =>
      db.all(sql, [], (err, rows) => (err ? reject(err) : resolve(rows)))
    );
  },

  /** Prochains contrats (>= today), tri ascendant, limit paramétrable */
  findUpcoming(limit = 3) {
    const sql = `
      SELECT id, date, lieu, description
      FROM contrats
      WHERE date >= ?
      ORDER BY date ASC
      LIMIT ?
    `;
    return new Promise((resolve, reject) =>
      db.all(sql, [todayIso(), limit], (err, rows) =>
        err ? reject(err) : resolve(rows)
      )
    );
  },

  /** Contrats passés (< today), tri descendant, limit paramétrable */
  findPast(limit = 3) {
    const sql = `
      SELECT id, date, lieu, description
      FROM contrats
      WHERE date < ?
      ORDER BY date DESC
      LIMIT ?
    `;
    return new Promise((resolve, reject) =>
      db.all(sql, [todayIso(), limit], (err, rows) =>
        err ? reject(err) : resolve(rows)
      )
    );
  },

  /** Insertion */
  create({ date, lieu, description }) {
    const sql = `INSERT INTO contrats (date, lieu, description) VALUES (?, ?, ?)`;
    return new Promise((resolve, reject) =>
      db.run(sql, [date, lieu, description], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, date, lieu, description });
      })
    );
  },

  /** Mise à jour */
  update(id, { date, lieu, description }) {
    const sql = `
      UPDATE contrats
      SET date = ?, lieu = ?, description = ?
      WHERE id = ?
    `;
    return new Promise((resolve, reject) =>
      db.run(sql, [date, lieu, description, id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      })
    );
  },

  /** Suppression */
  remove(id) {
    const sql = `DELETE FROM contrats WHERE id = ?`;
    return new Promise((resolve, reject) =>
      db.run(sql, [id], function (err) {
        if (err) return reject(err);
        resolve({ deleted: this.changes });
      })
    );
  },
};

module.exports = contratRepository;
