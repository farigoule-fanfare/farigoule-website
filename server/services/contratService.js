const db = require('../database');

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const contratService = {
  /**
   * Fetches upcoming contrats (events) from today onwards, ordered by date ascending.
   */
  getUpcomingContrats: async () => {
    try {
      const today = getTodayDateString();
      const sql = `SELECT id, date, lieu, description
                   FROM contrats
                   WHERE date >= ?
                   ORDER BY date ASC`;
      const rows = await new Promise((resolve, reject) => {
        db.all(sql, [today], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      return rows;
    } catch (error) {
      console.error('Error fetching upcoming contrats:', error.message);
      throw error;
    }
  },

  /**
   * Fetches past contrats (events) before today, ordered by date descending.
   */
  getPastContrats: async () => {
  try {
    const today = getTodayDateString();
    const sql = `
      SELECT id, date, lieu, description
      FROM contrats
      WHERE date < ?
      ORDER BY date DESC
    `;
    const rows = await new Promise((resolve, reject) => {
      db.all(sql, [today], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    return rows;
  } catch (error) {
    console.error('Error fetching past contrats:', error.message);
    throw error;
    }
  },

  /**
   * Fetches all contrats (events), ordered by date descending.
   */

  getAllContrats: async () => {
  try {
    const sql = `
      SELECT id, date, lieu, description
      FROM contrats
      ORDER BY date DESC
    `;
    const rows = await new Promise((resolve, reject) => {
      db.all(sql, [], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
    return rows;
  } catch (error) {
    console.error('Error fetching all contrats:', error.message);
    throw error;
  }
},


  /**
   * Adds a new contrat.
   * @param {{date: string, lieu: string, description: string}} contractData
   */
  addContrat: async ({ date, lieu, description }) => {
    try {
      const sql = `INSERT INTO contrats (date, lieu, description) VALUES (?, ?, ?)`;
      const result = await new Promise((resolve, reject) => {
        db.run(sql, [date, lieu, description], function(err) {
          if (err) reject(err);
          else resolve({ id: this.lastID, date, lieu, description });
        });
      });
      return result;
    } catch (error) {
      console.error('Error adding contrat:', error.message);
      throw error;
    }
  },

  /**
   * Updates an existing contrat by ID.
   * @param {number} id - The ID of the contrat to update.
   * @param {{date?: string, lieu?: string, description?: string}} contractData
   */
  updateContrat: async (id, { date, lieu, description }) => {
    try {
      const sql = `UPDATE contrats
                   SET date = ?, lieu = ?, description = ?
                   WHERE id = ?`;
      const changes = await new Promise((resolve, reject) => {
        db.run(sql, [date, lieu, description, id], function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        });
      });
      return { changes };
    } catch (error) {
      console.error('Error updating contrat:', error.message);
      throw error;
    }
  },

  /**
   * Deletes a contrat by ID.
   * @param {number} id - The ID of the contrat to delete.
   */
  deleteContrat: async (id) => {
    try {
      const sql = `DELETE FROM contrats WHERE id = ?`;
      const changes = await new Promise((resolve, reject) => {
        db.run(sql, [id], function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        });
      });
      return { deleted: changes };
    } catch (error) {
      console.error('Error deleting contrat:', error.message);
      throw error;
    }
  }
};

module.exports = contratService;
