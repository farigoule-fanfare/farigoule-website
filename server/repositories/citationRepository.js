const db = require('../services/databaseService');

const citationRepository = {
  /**
   * Récupère toutes les citations + surnom auteur.
   * @param {'random'|'alpha'} order
   * @returns {Promise<Array>}
   */
  findAllWithAuthors(order = 'random') {
    const orderClause = order === 'alpha' ? 'ORDER BY c.citation' : 'ORDER BY RANDOM()';
    const sql = `
      SELECT
        c.id,
        c.citation,
        c.auteur_id,
        COALESCE(f.surnom, 'Anonyme') AS auteurCitation
      FROM citations c
      LEFT JOIN fanfarons f ON c.auteur_id = f.id
      ${orderClause}
    `;
    return new Promise((resolve, reject) =>
      db.all(sql, [], (err, rows) => (err ? reject(err) : resolve(rows)))
    );
  },

  /**
   * Vérifie l’existence d’une citation identique (mot pour mot).
   * @param {string} citation
   * @returns {Promise<boolean>}
   */
  existsExact(citation) {
    const sql = 'SELECT 1 FROM citations WHERE citation = ? LIMIT 1';
    return new Promise((resolve, reject) =>
      db.get(sql, [citation], (err, row) => (err ? reject(err) : resolve(!!row)))
    );
  },

  /**
   * Insère une nouvelle citation.
   * @param {{ citation: string, auteur_id: number|null }}
   * @returns {Promise<{ id:number, citation:string, auteur_id:number|null }>}
   */
  create({ citation, auteur_id }) {
    const sql = 'INSERT INTO citations (citation, auteur_id) VALUES (?, ?)';
    return new Promise((resolve, reject) =>
      db.run(sql, [citation, auteur_id], function (err) {
        if (err) return reject(err);
        resolve({ id: this.lastID, citation, auteur_id });
      })
    );
  },

  /**
   * Met à jour une citation.
   * @param {number} id
   * @param {{ citation?: string, auteur_id?: number|null }}
   * @returns {Promise<{ changes:number }>}
   */
  update(id, { citation, auteur_id }) {
    const sql = 'UPDATE citations SET citation = ?, auteur_id = ? WHERE id = ?';
    return new Promise((resolve, reject) =>
      db.run(sql, [citation, auteur_id, id], function (err) {
        if (err) return reject(err);
        resolve({ changes: this.changes });
      })
    );
  },

  /**
   * Supprime une citation.
   * @param {number} id
   * @returns {Promise<{ deleted:number }>}
   */
  remove(id) {
    const sql = 'DELETE FROM citations WHERE id = ?';
    return new Promise((resolve, reject) =>
      db.run(sql, [id], function (err) {
        if (err) return reject(err);
        resolve({ deleted: this.changes });
      })
    );
  },
};

module.exports = citationRepository;
