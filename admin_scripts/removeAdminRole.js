/**
 * Script to remove the 'admin' role from an existing fanfaron.
 * Usage: node admin_scripts/removeAdminRole.js <surnom_or_email>
 *
 * This will parse the current roles JSON array, remove 'admin' if present,
 * and update the fanfaron's record in the database.
 */

const path = require('path');
// Adjust this path if your database module location differs
const db = require('../server/database/index.js');

async function removeAdminRole(identifier) {
  if (!identifier) {
    console.error('Usage: node admin_scripts/removeAdminRole.js <surnom_or_email>');
    process.exit(1);
  }

  console.info(`Looking up fanfaron: ${identifier}`);
  const findSql = `SELECT id, surnom, email, roles FROM fanfarons WHERE surnom = ? OR email = ?`;

  db.get(findSql, [identifier, identifier], (err, row) => {
    if (err) {
      console.error('Error querying database:', err.message);
      return shutdown(1);
    }
    if (!row) {
      console.error(`No fanfaron found for '${identifier}'.`);
      return shutdown(1);
    }

    console.info(`Found fanfaron ID=${row.id}, surnom=${row.surnom}, email=${row.email}`);

    let roles;
    try {
      roles = JSON.parse(row.roles);
      if (!Array.isArray(roles)) throw new Error();
    } catch {
      console.warn('Invalid roles JSON, resetting to empty array.');
      roles = [];
    }

    if (!roles.includes('admin')) {
      console.info('User does not have admin role. No update needed.');
      return shutdown(0);
    }

    // Remove 'admin' from roles
    const updatedRoles = roles.filter(r => r !== 'admin');
    const updatedRolesJson = JSON.stringify(updatedRoles);

    const updateSql = `UPDATE fanfarons SET roles = ? WHERE id = ?`;
    db.run(updateSql, [updatedRolesJson, row.id], function(updateErr) {
      if (updateErr) {
        console.error('Error updating roles:', updateErr.message);
        return shutdown(1);
      }
      if (this.changes > 0) {
        console.info(`Successfully removed 'admin' role from fanfaron ID ${row.id}.`);
      } else {
        console.error('No rows updated.');
      }
      shutdown(0);
    });
  });
}

function shutdown(code) {
  db.close(err => {
    if (err) console.error('Error closing DB:', err.message);
    process.exit(code);
  });
}

// Read identifier from CLI
const identifier = process.argv[2];
removeAdminRole(identifier);
