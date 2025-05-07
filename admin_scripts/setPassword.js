const bcrypt = require('bcryptjs');
const path = require('path');
// Adjust the path to your database module.
// This assumes the script is run from the project root 'farigoule-vercel/'.
const db = require('../server/database/index.js');

const SALT_ROUNDS = 10; // Must match SALT_ROUNDS in server/services/userService.js

async function setFanfaronPassword(identifier, plainPassword) {
    if (!identifier || !plainPassword) {
        console.error('Usage: node admin_scripts/setPassword.js <surnom_or_email> <password>');
        process.exit(1);
    }

    console.log(`Attempting to set password for identifier: ${identifier}`);

    try {
        const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);
        console.log(`Password hashed successfully.`);

        // Try to find by surnom first, then by email
        const findSql = "SELECT id, surnom, email FROM fanfarons WHERE surnom = ? OR email = ?";
        db.get(findSql, [identifier, identifier], (err, row) => {
            if (err) {
                console.error('Error finding fanfaron:', err.message);
                db.close();
                process.exit(1);
            }

            if (!row) {
                console.error(`Fanfaron with identifier '${identifier}' not found.`);
                db.close();
                process.exit(1);
            }

            console.log(`Found fanfaron: ID=${row.id}, Surnom=${row.surnom}, Email=${row.email}`);

            const updateSql = `UPDATE fanfarons SET password_hash = ? WHERE id = ?`;
            db.run(updateSql, [hashedPassword, row.id], function(updateErr) {
                if (updateErr) {
                    console.error('Error updating password:', updateErr.message);
                } else {
                    if (this.changes > 0) {
                        console.log(`Password updated successfully for fanfaron ID ${row.id} ('${identifier}').`);
                    } else {
                        console.error(`Failed to update password for fanfaron ID ${row.id}. No rows affected. This shouldn't happen if user was found.`);
                    }
                }
                // Close the database connection
                db.close((closeErr) => {
                    if (closeErr) {
                        console.error('Error closing database:', closeErr.message);
                    } else {
                        console.log('Database connection closed.');
                    }
                });
            });
        });

    } catch (error) {
        console.error('An unexpected error occurred:', error.message);
        if (db && typeof db.close === 'function') {
            db.close();
        }
        process.exit(1);
    }
}

// Get identifier and password from command line arguments
const identifier = process.argv[2];
const plainPassword = process.argv[3];

setFanfaronPassword(identifier, plainPassword); 