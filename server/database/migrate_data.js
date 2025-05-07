const fs = require('fs');
const path = require('path');
const db = require('./index.js'); // Assumes db connection is exported from index.js
const Buffer = require('buffer').Buffer; // Import Buffer

// Define paths for the individual export files
const fanfaronsFilePath = path.resolve(__dirname, '../../db_migration_project/fanfarons_export.json');
const citationsFilePath = path.resolve(__dirname, '../../db_migration_project/citations_export.json');
const diaposFilePath = path.resolve(__dirname, '../../db_migration_project/diapos_export.json');
const contratsFilePath = path.resolve(__dirname, '../../db_migration_project/contrats_export.json');

// --- Updated Cleaning Function ---
function cleanAndFixEncoding(text) {
    if (typeof text !== 'string') {
        return text;
    }

    let cleanedText = text;

    // 1. Clean common HTML entities first
    cleanedText = cleanedText.replace(/&nbsp;/g, ' ').trim();
    // Add more entity replacements if needed (e.g., &amp;, &lt;, &gt;)
    cleanedText = cleanedText.replace(/&amp;/g, '&');
    cleanedText = cleanedText.replace(/&lt;/g, '<');
    cleanedText = cleanedText.replace(/&gt;/g, '>');
    cleanedText = cleanedText.replace(/&quot;/g, '"');
    cleanedText = cleanedText.replace(/&apos;/g, "'");

    // Convert <br> tags to newlines first
    cleanedText = cleanedText.replace(/<br\s*\/?>/gi, '\n');

    // 2. Attempt to fix double-encoded UTF-8 (Mojibake from Latin1/Windows-1252 -> UTF8)
    try {
        // Heuristic check for common double-encoding patterns
        if (/[ÂÃ][-¿]/.test(cleanedText)) {
            const buffer = Buffer.from(cleanedText, 'latin1');
            const corrected = buffer.toString('utf8');
            // Only use the corrected string if it actually changed something
            if (corrected !== cleanedText) {
                 cleanedText = corrected;
            }
        }
    } catch (e) {
        console.warn(`Encoding fix (Latin1->UTF8) failed for: ${text.substring(0, 50)}...`);
        // Continue with the potentially still mangled string
    }

    // Fix for Ã‰ (Ã followed by U+2030 Per Mille sign) which should be É (E acute U+00C9)
    // This occurs in strings like "\u00c3\u2030cole" from the JSON.
    cleanedText = cleanedText.replace(/Ã‰/g, "É");

    // Fix for Åœ -> œ and Å’ -> Œ (e.g., FÅ“tus -> Fœtus)
    cleanedText = cleanedText.replace(/Åœ/g, "œ");
    cleanedText = cleanedText.replace(/Å’/g, "Œ");

    // 3. Fix specific remaining Mojibake patterns (often after the above step)
    // Example: Fix mangled apostrophes/smart quotes resulting from Windows-1252 issues
    cleanedText = cleanedText.replace(/â€™/g, "'"); // Common mangled apostrophe/right single quote (U+E2 U+20AC U+2122)
    cleanedText = cleanedText.replace(/â€˜/g, "'"); // Mangled left single quote (U+E2 U+20AC U+2DC)
    cleanedText = cleanedText.replace(/â€‹/g, "'"); // Mangled apostrophe (U+E2 U+20AC U+2039)
    cleanedText = cleanedText.replace(/â€œ/g, '"'); // Mangled left double quote (") (U+E2 U+20AC U+0153)
    cleanedText = cleanedText.replace(/â€\u009D/g, '"'); // Mangled right double quote (") (U+E2 U+20AC U+009D)
    cleanedText = cleanedText.replace(/â€¦/g, '...'); // Mangled ellipsis (U+E2 U+20AC U+00A6)
    cleanedText = cleanedText.replace(/â‚¬/g, '€'); // Mangled Euro sign (U+E2 U+201A U+00AC)
     // Add more replacements here if you notice other specific patterns

    // Normalize multiple newlines to a single newline
    cleanedText = cleanedText.replace(/\n+/g, '\n');

    return cleanedText.trim(); // Trim again at the end
}
// --- END Updated Cleaning Function ---

// Helper function to format date string to YYYY-MM-DD
function formatDateToSql(dateString) {
    if (!dateString || typeof dateString !== 'string') return null;
    try {
        const date = new Date(dateString.split(' ')[0]); // Take only the date part before splitting
        if (isNaN(date.getTime())) return null; // Invalid date
        // Format to YYYY-MM-DD
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    } catch (e) {
        console.warn(`Could not parse date string: ${dateString}`, e);
        return null;
    }
}

async function migrateData() {
    console.log('Starting data migration from separate files (with updated encoding fix)...');

    let fanfaronInsertStmt, citationInsertStmt, diapoInsertStmt, contratInsertStmt; // Statements

    try {
        // Read and parse fanfarons data
        const fanfaronsJsonRaw = fs.readFileSync(fanfaronsFilePath, 'utf8');
        const fanfaronsData = JSON.parse(fanfaronsJsonRaw);
        console.log(`Read ${fanfaronsData.length} fanfaron records from ${path.basename(fanfaronsFilePath)}.`);

        // Read and parse citations data
        const citationsJsonRaw = fs.readFileSync(citationsFilePath, 'utf8');
        const citationsData = JSON.parse(citationsJsonRaw);
        console.log(`Read ${citationsData.length} citation records from ${path.basename(citationsFilePath)}.`);

        // Read and parse diapos data
        const diaposJsonRaw = fs.readFileSync(diaposFilePath, 'utf8');
        const diaposData = JSON.parse(diaposJsonRaw);
        console.log(`Read ${diaposData.length} diapo records from ${path.basename(diaposFilePath)}.`);

        // Read and parse contrats data
        const contratsJsonRaw = fs.readFileSync(contratsFilePath, 'utf8');
        const contratsData = JSON.parse(contratsJsonRaw);
        console.log(`Read ${contratsData.length} contrat records from ${path.basename(contratsFilePath)}.`);

        const fanfaronIdMap = new Map();
        const usedEmails = new Set();

        await new Promise((resolve, reject) => db.run('BEGIN TRANSACTION', (err) => err ? reject(err) : resolve()));
        console.log('Started database transaction.');
        
        // Clear existing data for tables being migrated (optional, but makes script idempotent)
        await new Promise((resolve, reject) => db.run('DELETE FROM fanfarons;', (err) => err ? reject(err) : resolve()));
        await new Promise((resolve, reject) => db.run('DELETE FROM citations;', (err) => err ? reject(err) : resolve()));
        await new Promise((resolve, reject) => db.run('DELETE FROM diapos;', (err) => err ? reject(err) : resolve()));
        await new Promise((resolve, reject) => db.run('DELETE FROM contrats;', (err) => err ? reject(err) : resolve()));
        console.log('Cleared existing data from fanfarons, citations, diapos, and contrats tables.');


        // --- Insert Fanfarons --- (Logic remains similar)
        fanfaronInsertStmt = db.prepare(`INSERT INTO fanfarons (surnom, instrument, promo, bureau, tel, email, photo, description, password_hash, roles, prenom, nom) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL, 'fanfaron', NULL, NULL)`);
        for (const fanfaron of fanfaronsData) {
            const oldIdFanfaron = fanfaron.idFanfaron;
            const promoInt = fanfaron.promo ? parseInt(fanfaron.promo, 10) : null;
            let emailToInsert = fanfaron.mail;
            if (!emailToInsert || typeof emailToInsert !== 'string' || emailToInsert.trim() === '') {
                emailToInsert = `placeholder_${oldIdFanfaron}@${fanfaron.surnom?.replace(/[^a-zA-Z0-9]/g, '') || 'no_surnom'}.local`;
            } else if (usedEmails.has(emailToInsert)) {
                emailToInsert = `placeholder_${oldIdFanfaron}@${fanfaron.surnom?.replace(/[^a-zA-Z0-9]/g, '') || 'no_surnom'}.local`;
                 console.warn(`Duplicate email in source JSON: ${fanfaron.mail}. Using placeholder: ${emailToInsert}`);
            }
            usedEmails.add(emailToInsert);
            
            // ** APPLY CLEAN/FIX HERE **
            const fixedSurnom = cleanAndFixEncoding(fanfaron.surnom);
            const fixedInstrument = cleanAndFixEncoding(fanfaron.instrument);
            const fixedBureau = cleanAndFixEncoding(fanfaron.bureau);
            const fixedDescription = cleanAndFixEncoding(fanfaron.description);

            try {
                await new Promise((resolve, reject) => {
                    fanfaronInsertStmt.run(
                        fixedSurnom, fixedInstrument, promoInt, fixedBureau, 
                        fanfaron.tel, emailToInsert, fanfaron.photo, fixedDescription,
                        function(err) {
                            if (err) {
                                if (err.code === 'SQLITE_CONSTRAINT' && (err.message.includes('.email') || err.message.includes('.surnom'))) {
                                    console.warn(`UNIQUE constraint failed for ${err.message.includes('.email') ? 'email' : 'surnom'} ${err.message.includes('.email') ? emailToInsert : fixedSurnom} (Fanfaron ${oldIdFanfaron}). Skipping.`);
                                    resolve(); 
                                } else {
                                    console.error(`Error inserting fanfaron (old ID ${oldIdFanfaron}): ${fixedSurnom}`, err.message);
                                    reject(err);
                                }
                            } else {
                                fanfaronIdMap.set(oldIdFanfaron.toString(), this.lastID);
                                resolve();
                            }
                        }
                    );
                });
            } catch (insertError) { throw insertError; }
        }
        if (fanfaronInsertStmt) await new Promise((resolve, reject) => fanfaronInsertStmt.finalize(err => err ? reject(err) : resolve()));
        console.log(`Processed ${fanfaronsData.length} fanfarons. Inserted ${fanfaronIdMap.size} into SQLite and created ID map.`);

        // --- Insert Citations --- (Logic remains similar)
        citationInsertStmt = db.prepare(`INSERT INTO citations (citation, auteur_id) VALUES (?, ?)`);
        let citationsInsertedCount = 0;
        for (const citation of citationsData) {
            const oldAuteurId = citation.idFanfaron;
            const newAuteurId = fanfaronIdMap.get(oldAuteurId?.toString());
            
            // ** APPLY CLEAN/FIX HERE **
            const fixedCitationText = cleanAndFixEncoding(citation.citation);
            if (newAuteurId && fixedCitationText) {
                 try {
                    await new Promise((resolve, reject) => {
                        citationInsertStmt.run(fixedCitationText, newAuteurId, (err) => {
                            if (err) {
                                console.error(`Error inserting citation for old auteur_id ${oldAuteurId}: \"${fixedCitationText.substring(0, 30)}...\"`, err.message);
                                reject(err);
                            } else {
                                citationsInsertedCount++;
                                resolve();
                            }
                        });
                    });
                } catch (insertError) { throw insertError; }
            } else if (!newAuteurId) {
                 console.warn(`Could not find new fanfaron ID for old auteur_id: ${oldAuteurId} (Citation: \"${fixedCitationText?.substring(0, 30)}...\"). Skipping.`);
            } else {
                 console.warn(`Skipping citation with empty text after cleaning for old auteur_id: ${oldAuteurId}.`);
            }
        }
        if (citationInsertStmt) await new Promise((resolve, reject) => citationInsertStmt.finalize(err => err ? reject(err) : resolve()));
        console.log(`Inserted ${citationsInsertedCount} citations into SQLite.`);
        
        // --- Insert Diapos --- 
        diapoInsertStmt = db.prepare(`INSERT INTO diapos (fichier, description) VALUES (?, ?)`);
        let diaposInsertedCount = 0;
        for (const diapo of diaposData) {
            // ** APPLY CLEAN/FIX HERE **
            const fixedDescription = cleanAndFixEncoding(diapo.description);
            if (diapo.fichier) {
                 try {
                    await new Promise((resolve, reject) => {
                        diapoInsertStmt.run(diapo.fichier, fixedDescription, (err) => {
                            if (err) {
                                console.error(`Error inserting diapo ${diapo.fichier}:`, err.message);
                                reject(err);
                            } else {
                                diaposInsertedCount++;
                                resolve();
                            }
                        });
                    });
                } catch (insertError) { throw insertError; }
            } else {
                console.warn(`Skipping diapo with missing fichier name: ${JSON.stringify(diapo)}`);
            }
        }
        if (diapoInsertStmt) await new Promise((resolve, reject) => diapoInsertStmt.finalize(err => err ? reject(err) : resolve()));
        console.log(`Inserted ${diaposInsertedCount} diapos into SQLite.`);

        // --- Insert Contrats --- 
        contratInsertStmt = db.prepare(`INSERT INTO contrats (date, lieu, description) VALUES (?, ?, ?)`);
        let contratsInsertedCount = 0;
        for (const contrat of contratsData) {
            const sqlDate = formatDateToSql(contrat.date); // Format date
            
            // ** APPLY CLEAN/FIX HERE **
            const fixedLieu = cleanAndFixEncoding(contrat.lieu);
            const fixedDescription = cleanAndFixEncoding(contrat.description);
            if (sqlDate) { // Only insert if date is valid
                try {
                    await new Promise((resolve, reject) => {
                        contratInsertStmt.run(sqlDate, fixedLieu, fixedDescription, (err) => {
                            if (err) {
                                console.error(`Error inserting contrat on ${sqlDate} at ${fixedLieu}:`, err.message);
                                reject(err);
                            } else {
                                contratsInsertedCount++;
                                resolve();
                            }
                        });
                    });
                } catch (insertError) { throw insertError; }
            } else {
                console.warn(`Skipping contrat due to invalid/missing date: ${JSON.stringify(contrat)}`);
            }
        }
        if (contratInsertStmt) await new Promise((resolve, reject) => contratInsertStmt.finalize(err => err ? reject(err) : resolve()));
        console.log(`Inserted ${contratsInsertedCount} contrats into SQLite.`);

        // Commit transaction
        await new Promise((resolve, reject) => db.run('COMMIT', (err) => err ? reject(err) : resolve()));
        console.log('Committed database transaction.');

        console.log('Data migration completed successfully!');

    } catch (error) {
        console.error('Error during data migration:', error);
        // Rollback and finalize statements
        try {
            if (fanfaronInsertStmt) await new Promise((resolve) => fanfaronInsertStmt.finalize(() => resolve()));
            if (citationInsertStmt) await new Promise((resolve) => citationInsertStmt.finalize(() => resolve()));
            if (diapoInsertStmt) await new Promise((resolve) => diapoInsertStmt.finalize(() => resolve()));
            if (contratInsertStmt) await new Promise((resolve) => contratInsertStmt.finalize(() => resolve()));
        } catch (finalizeError) {
            console.error('Error finalizing statements during error handling:', finalizeError);
        }
        await new Promise((resolve) => db.run('ROLLBACK', () => resolve()));
        console.log('Rolled back database transaction due to error.');
    } finally {
        db.close((err) => {
            if (err) {
                if (err.code !== 'SQLITE_BUSY') { // Don't log error if DB is just busy closing elsewhere
                    console.error('Error closing database connection:', err.message);
                }
            } else {
                console.log('Closed the database connection.');
            }
        });
    }
}

migrateData();