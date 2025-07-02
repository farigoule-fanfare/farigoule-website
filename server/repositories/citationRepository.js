const { _native: db } = require('../services/databaseService');

const citationRepository = {
  /**
   * Récupère toutes les citations.
   * @returns {Promise<Array<{id:number,citation:string,auteur_id:number|null,auteurCitation:string}>>}
   */
  async findAll() {
    return db.prepare(`
      SELECT c.id, c.citation, c.auteur_id,
             COALESCE(f.surnom, 'Anonyme') AS auteurCitation
        FROM citations c
        LEFT JOIN fanfarons f ON c.auteur_id = f.id
       ORDER BY c.citation
    `).all();
  },

  /**
   * Renvoie une citation tirée au hasard.
   * @returns {Promise<{id:number,citation:string,auteur_id:number|null,auteurCitation:string}|null>}
   */
  async findRandom() {
    return db.prepare(`
      SELECT c.id, c.citation, c.auteur_id,
             COALESCE(f.surnom, 'Anonyme') AS auteurCitation
        FROM citations c
        LEFT JOIN fanfarons f ON c.auteur_id = f.id
       ORDER BY RANDOM()
       LIMIT 1
    `).get();
  },

  /** Vérifie l'existence d'une citation identique (mot pour mot). */
  async existsExact(citation) {
    const row = db
      .prepare('SELECT 1 FROM citations WHERE citation = ? LIMIT 1')
      .get(citation);
    return !!row;
  },

  /** Insère une nouvelle citation et renvoie son id. */
  async create({ citation, auteur_id }) {
    const { lastInsertRowid } = db
      .prepare('INSERT INTO citations (citation, auteur_id) VALUES (?, ?)')
      .run(citation, auteur_id);
    return { id: lastInsertRowid, citation, auteur_id };
  },

  /** Met à jour une citation existante. */
  async update(id, { citation, auteur_id }) {
    const { changes } = db
      .prepare('UPDATE citations SET citation = ?, auteur_id = ? WHERE id = ?')
      .run(citation, auteur_id, id);
    return { changes };
  },

  /** Supprime une citation ; renvoie le nombre de lignes supprimées. */
  async remove(id) {
    const { changes } = db
      .prepare('DELETE FROM citations WHERE id = ?')
      .run(id);
    return { deleted: changes };
  },
};

module.exports = citationRepository;