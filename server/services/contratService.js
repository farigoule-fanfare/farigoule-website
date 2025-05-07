const db = require('../database');

// Helper function to get today's date in YYYY-MM-DD format
function getTodayDateString() {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}

const contratService = {
    /**
     * Fetches upcoming contrats (events) from today onwards, ordered by date ascending.
     * @returns {Promise<Array<object>>} A promise that resolves to an array of upcoming contrat objects.
     */
    getUpcomingContrats: () => {
        return new Promise((resolve, reject) => {
            const today = getTodayDateString();
            const sql = `SELECT id, date, lieu, description 
                         FROM contrats 
                         WHERE date >= ? 
                         ORDER BY date ASC`;
            
            db.all(sql, [today], (err, rows) => {
                if (err) {
                    console.error("Error fetching upcoming contrats:", err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    /**
     * Fetches past contrats (events) before today, ordered by date descending.
     * @param {number} [limit=3] - The maximum number of past contrats to return.
     * @returns {Promise<Array<object>>} A promise that resolves to an array of past contrat objects.
     */
    getPastContrats: (limit = 3) => {
        return new Promise((resolve, reject) => {
            const today = getTodayDateString();
            const sql = `SELECT id, date, lieu, description 
                         FROM contrats 
                         WHERE date < ? 
                         ORDER BY date DESC 
                         LIMIT ?`;
            
            db.all(sql, [today, limit], (err, rows) => {
                if (err) {
                    console.error("Error fetching past contrats:", err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    // TODO: Add functions for admin panel (addContrat, deleteContrat, updateContrat) later
    // addContrat: ({ date, lieu, description }) => { ... }
    // deleteContrat: (id) => { ... }
};

module.exports = contratService; 