const db = require('../services/databaseService');

function buildWhere({ since, until }, params) {
  const clauses = [];
  if (since) { clauses.push('date >= ?'); params.push(since); }
  if (until) { clauses.push('date <  ?'); params.push(until); }
  return clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
}

const contratRepository = {
  /**
   * Récupération générique des contrats.
   * @param {{ since?:string, until?:string, order?:'asc'|'desc', limit?:number }}
   */
  find({ since, until, order = 'desc', limit }) {
    const params = [];
    const where   = buildWhere({ since, until }, params);
    const orderBy = `ORDER BY date ${order.toUpperCase()}`;
    const limitCl = limit ? 'LIMIT ?' : '';
    if (limit) params.push(limit);

    const sql = `
      SELECT id, date, lieu, description
      FROM contrats
      ${where}
      ${orderBy}
      ${limitCl}
    `;
    return new Promise((resolve, reject) =>
      db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
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
