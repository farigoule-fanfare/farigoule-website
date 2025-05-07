const db = require('../database');

const diapoService = {
    /**
     * Fetches the latest diapos (carousel slides).
     * @param {number} [limit=5] - The maximum number of slides to return.
     * @returns {Promise<Array<object>>} A promise that resolves to an array of diapo objects.
     */
    getLatestDiapos: (limit = 5) => {
        return new Promise((resolve, reject) => {
            // Order by ID descending to get the latest ones
            const sql = `SELECT id, fichier, description, created_at 
                         FROM diapos 
                         ORDER BY id DESC 
                         LIMIT ?`;
            
            db.all(sql, [limit], (err, rows) => {
                if (err) {
                    console.error("Error fetching latest diapos:", err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    /**
     * Fetches a single random diapo (carousel slide).
     * @returns {Promise<object|null>} A promise that resolves to a single random diapo object or null if none found.
     */
    getRandomDiapo: () => {
        return new Promise((resolve, reject) => {
            const sql = `SELECT id, fichier, description, created_at
                         FROM diapos
                         ORDER BY RANDOM()
                         LIMIT 1`;
            
            db.get(sql, [], (err, row) => { // Use db.get for a single row
                if (err) {
                    console.error("Error fetching random diapo:", err.message);
                    reject(err);
                } else {
                    resolve(row); // Returns the single row object or undefined if no rows
                }
            });
        });
    },

    /**
     * Fetches all diapos (carousel slides), ordered by ID descending (latest first).
     * @returns {Promise<Array<object>>} A promise that resolves to an array of all diapo objects.
     */
    getAllDiapos: () => {
        return new Promise((resolve, reject) => {
            // Order by ID descending to get latest first
            const sql = `SELECT id, fichier, description, created_at 
                         FROM diapos 
                         ORDER BY id DESC`;
            
            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error("Error fetching all diapos:", err.message);
                    reject(err);
                } else {
                    resolve(rows);
                }
            });
        });
    },

    // TODO: Add functions for admin panel (addDiapo, deleteDiapo) later
    // addDiapo: ({ fichier, description }) => { ... }
    // deleteDiapo: (id) => { ... }
};

module.exports = diapoService; 