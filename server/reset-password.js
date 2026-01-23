const bcrypt = require('bcryptjs');
const Database = require('better-sqlite3');

const db = new Database('./database/farigoule.sqlite');
const newPassword = 'test'; // Changez-le !
const surnom = 'Bituume';

const hash = bcrypt.hashSync(newPassword, 10);

const stmt = db.prepare('UPDATE fanfarons SET password_hash = ? WHERE surnom = ?');
const info = stmt.run(hash, surnom);

if (info.changes > 0) {
  console.log(`✅ Password updated for ${surnom}`);
} else {
  console.log(`❌ User ${surnom} not found`);
}

db.close();