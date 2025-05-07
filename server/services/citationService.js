const db = require('../database'); // Adjust path if your db connection is elsewhere

/**
 * Fetches all citations along with their authors' nicknames.
 * @returns {Promise<Array<{citation: string, auteurCitation: string}>>}
 */
function getAllCitationsWithAuthors() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
                c.citation AS citation,
                f.surnom AS auteurCitation
            FROM citations c
            LEFT JOIN fanfarons f ON c.auteur_id = f.id
            ORDER BY RANDOM()
        `;

        db.all(sql, [], (err, rows) => {
            if (err) {
                console.error("Error fetching citations with authors:", err.message);
                reject(err);
            } else {
                // Ensure rows have the correct structure, especially if auteurCitation might be null
                const formattedRows = rows.map(row => ({
                    citation: row.citation,
                    auteurCitation: row.auteurCitation || "Anonyme" // Fallback if author is null
                }));
                resolve(formattedRows);
            }
        });
    });
}

module.exports = {
    getAllCitationsWithAuthors
}; 