const db = require('../services/databaseService');

/** Construit dynamiquement la clause WHERE (date >= since AND date < until). */
function buildWhere({ since, until }, params) {
  const clauses = [];
  if (since) { clauses.push('date >= ?'); params.push(since); }
  if (until) { clauses.push('date <  ?'); params.push(until); }
  return clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
}

const contratRepository = {
  /**
   * Recherche générique de contrats.
   * @param {{ since?:string, until?:string, order?:'asc'|'desc', limit?:number }} opts
   * @returns {Promise<Array<{id:number,date:string,lieu:string,description:string}>>}
   */
  async find({ since, until, order = 'desc', limit } = {}) {
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
    return db.prepare(sql).all(...params);
  },

  /**
   * Insertion d'un contrat.
   * @param {{ date:string, lieu:string, description:string }} data
   * @returns {Promise<{id:number,date:string,lieu:string,description:string}>}
   */
  async create({ date, lieu, description }) {
    const { lastInsertRowid } = db
      .prepare('INSERT INTO contrats (date, lieu, description) VALUES (?, ?, ?)')
      .run(date, lieu, description);
    return { id: lastInsertRowid, date, lieu, description };
  },

  /**
   * Mise à jour d'un contrat.
   * @param {number} id
   * @param {{ date:string, lieu:string, description:string }} patch
   * @returns {Promise<{changes:number}>}
   */
  async update(id, { date, lieu, description }) {
    const { changes } = db
      .prepare(
        'UPDATE contrats SET date = ?, lieu = ?, description = ? WHERE id = ?'
      )
      .run(date, lieu, description, id);
    return { changes };
  },

  /**
   * Suppression d'un contrat.
   * @param {number} id
   * @returns {Promise<{deleted:number}>}
   */
  async remove(id) {
    const { changes } = db
      .prepare('DELETE FROM contrats WHERE id = ?')
      .run(id);
    return { deleted: changes };
  },
};

module.exports = contratRepository;
