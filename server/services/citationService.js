const db = require('../database');

/**
 * Service for managing citations and related data.
 */
const citationService = {
  /**
   * Fetches all citations along with their authors' nicknames in random order.
   * @returns {Promise<Array<{ id: number, citation: string, auteur_id: number, auteurCitation: string }>>}
   */
  getAllCitationsWithAuthors: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          c.id AS id,
          c.citation AS citation,
          c.auteur_id AS auteur_id,
          COALESCE(f.surnom, 'Anonyme') AS auteurCitation
        FROM citations c
        LEFT JOIN fanfarons f ON c.auteur_id = f.id
        ORDER BY RANDOM()
      `;
      db.all(sql, [], (err, rows) => {
        if (err) {
          console.error('Error fetching citations with authors:', err.message);
          return reject(err);
        }
        resolve(rows);
      });
    });
  },

  getAllCitationsWithAuthorsOrdered: () => {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT 
          c.id AS id,
          c.citation AS citation,
          c.auteur_id AS auteur_id,
          COALESCE(f.surnom, 'Anonyme') AS auteurCitation
        FROM citations c
        LEFT JOIN fanfarons f ON c.auteur_id = f.id
        ORDER BY citation
      `;
      db.all(sql, [], (err, rows) => {
        if (err) {
          console.error('Error fetching citations with authors:', err.message);
          return reject(err);
        }
        resolve(rows);
      });
    });
  },

  /**
   * Fetches a single citation by its ID.
   * @param {number} id
   * @returns {Promise<{ id: number, citation: string, auteur_id: number }|null>}
   */
  getCitationById: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `SELECT id, citation, auteur_id FROM citations WHERE id = ?`;
      db.get(sql, [id], (err, row) => {
        if (err) {
          console.error('Error fetching citation by ID:', err.message);
          return reject(err);
        }
        resolve(row || null);
      });
    });
  },

  /**
   * Adds a new citation to the database.
   * @param {{ citation: string, auteur_id: number }} data
   * @returns {Promise<{ id: number, citation: string, auteur_id: number }>}
   */
  addCitation: ({ citation, auteur_id }) => {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO citations (citation, auteur_id) VALUES (?, ?)`;
      db.run(sql, [citation, auteur_id], function(err) {
        if (err) {
          console.error('Error adding citation:', err.message);
          return reject(err);
        }
        resolve({ id: this.lastID, citation, auteur_id });
      });
    });
  },

  /**
   * Updates an existing citation by its ID.
   * @param {number} id
   * @param {{ citation?: string, auteur_id?: number }} data
   * @returns {Promise<{ changes: number }>}
   */
  updateCitation: (id, { citation, auteur_id }) => {
    return new Promise((resolve, reject) => {
      const sql = `UPDATE citations SET citation = ?, auteur_id = ? WHERE id = ?`;
      db.run(sql, [citation, auteur_id, id], function(err) {
        if (err) {
          console.error('Error updating citation:', err.message);
          return reject(err);
        }
        resolve({ changes: this.changes });
      });
    });
  },

  /**
   * Deletes a citation by its ID.
   * @param {number} id
   * @returns {Promise<{ deleted: number }>}
   */
  deleteCitation: (id) => {
    return new Promise((resolve, reject) => {
      const sql = `DELETE FROM citations WHERE id = ?`;
      db.run(sql, [id], function(err) {
        if (err) {
          console.error('Error deleting citation:', err.message);
          return reject(err);
        }
        resolve({ deleted: this.changes });
      });
    });
  }
};

module.exports = citationService;
