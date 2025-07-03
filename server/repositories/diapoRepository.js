const db = require('../services/databaseService');

const diapoRepository = {
  /**
   * Récupère des diapos, éventuellement limitées et/ou triées.
   * @param {Object}   [options]
   * @param {'asc'|'desc'|'random'} [options.order='desc']
   * @param {number}  [options.limit]
   * @returns {Promise<Array<{id:number,fichier:string,description:string,created_at:number}>>}
   */
  async find({ order = 'desc', limit } = {}) {
    // Construction dynamique des clauses ORDER / LIMIT
    const orderClause = order === 'random'
      ? 'ORDER BY RANDOM()'
      : `ORDER BY id ${order.toUpperCase()}`;

    const limitClause = limit ? 'LIMIT ?' : '';
    const sql = `
      SELECT id, fichier, description, created_at
        FROM diapos
        ${orderClause}
        ${limitClause}
    `;

    const stmt = db.prepare(sql);
    return limit ? stmt.all(limit) : stmt.all();
  },

  /**
   * Insère une nouvelle diapo et renvoie ses métadonnées.
   * @param {{fichier:string, description:string}} payload
   * @returns {Promise<{id:number,fichier:string,description:string,created_at:string}>}
   */
  async create({ fichier, description }) {
    const { lastInsertRowid } = db
      .prepare(`
        INSERT INTO diapos (fichier, description, created_at)
        VALUES (?, ?, strftime('%s','now'))
      `)
      .run(fichier, description);

    return {
      id: lastInsertRowid,
      fichier,
      description,
      created_at: new Date().toISOString(),
    };
  },

  /**
   * Met à jour une diapo (seuls les champs fournis sont modifiés).
   * @param {number} id
   * @param {{fichier?:string, description?:string}} patch
   * @returns {Promise<{id:number,fichier?:string,description?:string,changes:number}>}
   */
  async update(id, { fichier, description }) {
    const { changes } = db
      .prepare(`
        UPDATE diapos
           SET fichier     = COALESCE(?, fichier),
               description = COALESCE(?, description)
         WHERE id = ?
      `)
      .run(fichier, description, id);

    return { id, fichier, description, changes };
  },

  /**
   * Supprime une diapo.
   * @param {number} id
   * @returns {Promise<{deleted:number}>}
   */
  async remove(id) {
    const { changes } = db
      .prepare('DELETE FROM diapos WHERE id = ?')
      .run(id);

    return { deleted: changes };
  },
};

module.exports = diapoRepository;
