const fs = require('fs');
const path = require('path');
const db = require('./index.js'); // Assumes db connection is exported from index.js

const fanfaronsFilePath = path.resolve(__dirname, '../../db_migration_project/fanfarons_export.json');
const citationsFilePath = path.resolve(__dirname, '../../db_migration_project/citations_export.json');

async function migrateData() {
    console.log('Starting data migration...');

    let fanfaronInsertStmt; // Define statement variables outside try block
    let citationInsertStmt;

    try {
        // Read and parse fanfarons data
        const fanfaronsJsonRaw = fs.readFileSync(fanfaronsFilePath, 'utf-8');
        const fanfaronsData = JSON.parse(fanfaronsJsonRaw);
        console.log(`Read ${fanfaronsData.length} fanfaron records from JSON.`);

        // Read and parse citations data
        const citationsJsonRaw = fs.readFileSync(citationsFilePath, 'utf-8');
        const citationsData = JSON.parse(citationsJsonRaw);
        console.log(`Read ${citationsData.length} citation records from JSON.`);

        const fanfaronIdMap = new Map();
        const usedEmails = new Set(); // Keep track of emails used in this batch

        await new Promise((resolve, reject) => db.run('BEGIN TRANSACTION', (err) => err ? reject(err) : resolve()));
        console.log('Started database transaction.');

        // Insert fanfarons
        fanfaronInsertStmt = db.prepare(`
            INSERT INTO fanfarons (surnom, instrument, promo, bureau, tel, email, photo, description, password_hash, roles, prenom, nom)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, 'fanfaron', NULL, NULL)
        `);

        for (const fanfaron of fanfaronsData) {
            const oldIdFanfaron = fanfaron.idFanfaron;
            const promoInt = fanfaron.promo ? parseInt(fanfaron.promo, 10) : null;
            let emailToInsert = fanfaron.mail;

            // Handle potentially missing or duplicate emails
            if (!emailToInsert || typeof emailToInsert !== 'string' || emailToInsert.trim() === '') {
                emailToInsert = `placeholder_${oldIdFanfaron}@${fanfaron.surnom?.replace(/[^a-zA-Z0-9]/g, '') || 'no_surnom'}.local`;
                console.log(`Generated placeholder email for fanfaron ${oldIdFanfaron} (${fanfaron.surnom}): ${emailToInsert}`);
            } else if (usedEmails.has(emailToInsert)) {
                console.warn(`Duplicate email found in source JSON: ${emailToInsert} for fanfaron ${oldIdFanfaron} (${fanfaron.surnom}). Generating placeholder.`);
                emailToInsert = `placeholder_${oldIdFanfaron}@${fanfaron.surnom?.replace(/[^a-zA-Z0-9]/g, '') || 'no_surnom'}.local`;
            }

            usedEmails.add(emailToInsert); // Add email to the set for subsequent checks

            try {
                await new Promise((resolve, reject) => {
                    fanfaronInsertStmt.run(
                        fanfaron.surnom,
                        fanfaron.instrument,
                        promoInt,
                        fanfaron.bureau,
                        fanfaron.tel,
                        emailToInsert, // Use potentially modified email
                        fanfaron.photo,
                        fanfaron.description,
                        function(err) {
                            if (err) {
                                // Check if it's a UNIQUE constraint violation specifically on email
                                if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('.email')) {
                                    console.warn(`UNIQUE constraint failed for email ${emailToInsert} (Fanfaron ${oldIdFanfaron} - ${fanfaron.surnom}). This might indicate pre-existing data or issues not caught by initial check. Skipping fanfaron.`);
                                    resolve(); // Resolve promise to continue loop, skipping this user
                                } else {
                                    console.error(`Error inserting fanfaron (old ID ${oldIdFanfaron}): ${fanfaron.surnom}`, err.message);
                                    reject(err); // Reject for other errors
                                }
                            } else {
                                fanfaronIdMap.set(oldIdFanfaron.toString(), this.lastID);
                                resolve();
                            }
                        }
                    );
                });
            } catch (insertError) {
                // If promise was rejected, re-throw to stop the whole migration
                throw insertError;
            }
        }
        // Finalize fanfaron statement only after the loop completes successfully
        if (fanfaronInsertStmt) await new Promise((resolve, reject) => fanfaronInsertStmt.finalize(err => err ? reject(err) : resolve()));
        console.log(`Processed ${fanfaronsData.length} fanfarons. Inserted ${fanfaronIdMap.size} into SQLite and created ID map.`);

        // Insert citations
        citationInsertStmt = db.prepare(`
            INSERT INTO citations (citation, auteur_id)
            VALUES (?, ?)
        `);

        let citationsInsertedCount = 0;
        for (const citation of citationsData) {
            const oldAuteurId = citation.idFanfaron;
            const newAuteurId = fanfaronIdMap.get(oldAuteurId?.toString());

            if (newAuteurId) {
                try {
                    await new Promise((resolve, reject) => {
                        citationInsertStmt.run(citation.citation, newAuteurId, (err) => {
                            if (err) {
                                console.error(`Error inserting citation for old auteur_id ${oldAuteurId}: "${citation.citation?.substring(0, 30)}..."`, err.message);
                                reject(err);
                            } else {
                                citationsInsertedCount++;
                                resolve();
                            }
                        });
                    });
                } catch (insertError) {
                    throw insertError; // Stop migration on citation insert error
                }
            } else {
                console.warn(`Could not find new fanfaron ID for old auteur_id: ${oldAuteurId} (Citation: "${citation.citation?.substring(0, 30)}..."). Skipping.`);
            }
        }
        // Finalize citation statement only after the loop completes successfully
        if (citationInsertStmt) await new Promise((resolve, reject) => citationInsertStmt.finalize(err => err ? reject(err) : resolve()));
        console.log(`Inserted ${citationsInsertedCount} citations into SQLite.`);

        // Commit transaction
        await new Promise((resolve, reject) => db.run('COMMIT', (err) => err ? reject(err) : resolve()));
        console.log('Committed database transaction.');

        console.log('Data migration completed successfully!');

    } catch (error) {
        console.error('Error during data migration:', error);
        // Attempt to finalize statements before rollback
        try {
            if (fanfaronInsertStmt) await new Promise((resolve) => fanfaronInsertStmt.finalize(() => resolve()));
            if (citationInsertStmt) await new Promise((resolve) => citationInsertStmt.finalize(() => resolve()));
        } catch (finalizeError) {
            console.error('Error finalizing statements during error handling:', finalizeError);
        }
        // Rollback transaction
        await new Promise((resolve) => db.run('ROLLBACK', () => resolve()));
        console.log('Rolled back database transaction due to error.');
    } finally {
        // Close the database connection
        db.close((err) => {
            if (err) {
                // Ignore SQLITE_BUSY error here as we attempted cleanup
                if (err.code !== 'SQLITE_BUSY') {
                    console.error('Error closing database connection:', err.message);
                }
            } else {
                console.log('Closed the database connection.');
            }
        });
    }
}

migrateData(); 