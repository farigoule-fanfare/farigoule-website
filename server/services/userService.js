const db = require('../database');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10; // Cost factor for bcrypt hashing

/**
 * Utility to safely parse JSON roles field
 */
function parseRoles(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Invalid roles JSON:', raw);
    return [];
  }
}

/**
 * Finds a fanfaron by their unique email.
 * @param {string} email 
 * @returns {Promise<object|null>} Fanfaron object including password_hash and roles (as array), or null if not found.
 */
async function findFanfaronByEmail(email) {
  if (!email) return null;
  const sql = 'SELECT * FROM fanfarons WHERE email = ?';
  return new Promise((resolve, reject) => {
    db.get(sql, [email], (err, row) => {
      if (err) {
        console.error('Error finding fanfaron by email:', err.message);
        return reject(err);
      }
      if (!row) return resolve(null);
      row.roles = parseRoles(row.roles);
      resolve(row);
    });
  });
}

/**
 * Finds a fanfaron by their unique surnom.
 * @param {string} surnom 
 * @returns {Promise<object|null>} Fanfaron object including password_hash and roles (as array), or null if not found.
 */
async function findFanfaronBySurnom(surnom) {
  if (!surnom) return null;
  const sql = 'SELECT * FROM fanfarons WHERE surnom = ?';
  return new Promise((resolve, reject) => {
    db.get(sql, [surnom], (err, row) => {
      if (err) {
        console.error('Error finding fanfaron by surnom:', err.message);
        return reject(err);
      }
      if (!row) return resolve(null);
      row.roles = parseRoles(row.roles);
      resolve(row);
    });
  });
}

/**
 * Finds a fanfaron by their ID.
 * @param {number} id 
 * @returns {Promise<object|null>} Fanfaron object (excluding password_hash) or null.
 */
async function findFanfaronById(id) {
  if (!id) return null;
  const sql = 'SELECT id, surnom, prenom, nom, instrument, promo, bureau, tel, email, photo, description, roles FROM fanfarons WHERE id = ?';
  return new Promise((resolve, reject) => {
    db.get(sql, [id], (err, row) => {
      if (err) {
        console.error('Error finding fanfaron by ID:', err.message);
        return reject(err);
      }
      if (!row) return resolve(null);
      row.roles = parseRoles(row.roles);
      resolve(row);
    });
  });
}

/**
 * Compares a plaintext password with a stored hash.
 * @param {string} plainPassword 
 * @param {string} hashedPassword 
 * @returns {Promise<boolean>} True if passwords match, false otherwise.
 */
async function comparePassword(plainPassword, hashedPassword) {
  if (!plainPassword || !hashedPassword) return false;
  return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Creates a new fanfaron (e.g., by an admin).
 * Hashes the password before insertion.
 * @param {object} fanfaronData - Object containing fanfaron details (surnom, email, plainPassword, promo, etc.)
 *        roles should be an array of strings, e.g. ['fanfaron','admin']
 * @returns {Promise<object>} The newly created fanfaron object (excluding password_hash).
 */
async function createFanfaron(fanfaronData) {
  if (!fanfaronData?.surnom || !fanfaronData.email || !fanfaronData.plainPassword) {
    throw new Error('Missing required fields (surnom, email, plainPassword)');
  }
  const hashedPassword = await bcrypt.hash(fanfaronData.plainPassword, SALT_ROUNDS);
  // Ensure roles is array and stringify for storage
  const rolesArray = Array.isArray(fanfaronData.roles) ? fanfaronData.roles : ['fanfaron'];
  const rolesJson = JSON.stringify(rolesArray);

  const sql = `INSERT INTO fanfarons 
    (surnom, prenom, nom, instrument, promo, bureau, tel, email, photo, description, password_hash, roles)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const params = [
    fanfaronData.surnom,
    fanfaronData.prenom || null,
    fanfaronData.nom || null,
    fanfaronData.instrument || null,
    fanfaronData.promo ? parseInt(fanfaronData.promo, 10) : null,
    fanfaronData.bureau || null,
    fanfaronData.tel || null,
    fanfaronData.email,
    fanfaronData.photo || null,
    fanfaronData.description || null,
    hashedPassword,
    rolesJson
  ];

  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        console.error('Error creating fanfaron:', err.message);
        if (err.code === 'SQLITE_CONSTRAINT') {
          if (err.message.includes('.email')) return reject(new Error(`Email exists: ${fanfaronData.email}`));
          if (err.message.includes('.surnom')) return reject(new Error(`Surnom exists: ${fanfaronData.surnom}`));
        }
        return reject(err);
      }
      findFanfaronById(this.lastID)
        .then(newUser => resolve(newUser))
        .catch(fetchErr => reject(fetchErr));
    });
  });
}

/**
 * Finds the current president.
 * Assumes the president has "president" in their 'bureau' field.
 * Returns the one with the highest ID if multiple.
 * @returns {Promise<object|null>} President's details or null.
 */
async function getCurrentPresident() {
  const sql = `SELECT id, surnom, prenom, nom, email, bureau, promo, tel, roles
               FROM fanfarons WHERE lower(bureau) LIKE '%president%' 
               ORDER BY id DESC LIMIT 1`;
  return new Promise((resolve, reject) => {
    db.get(sql, [], (err, row) => {
      if (err) {
        console.error('Error finding current president:', err.message);
        return reject(err);
      }
      if (!row) return resolve(null);
      row.roles = parseRoles(row.roles);
      resolve(row);
    });
  });
}

/**
 * Updates the profile of a user (nom, prenom, email, telephone only)
 * @param {number} userId
 * @param {object} updates - { nom, prenom, email, telephone }
 * @returns {Promise<object>} Updated user (excluding password_hash)
 */
async function updateProfile(userId, updates) {
  if (!userId) throw new Error('User ID is required');
  const fields = {};
  if (updates.nom !== undefined) fields.nom = updates.nom;
  if (updates.prenom !== undefined) fields.prenom = updates.prenom;
  if (updates.email !== undefined) fields.email = updates.email;
  if (updates.telephone !== undefined) fields.tel = updates.telephone;
  if (!Object.keys(fields).length) throw new Error('No valid fields');

  const setClause = Object.keys(fields).map(f => `${f} = ?`).join(', ');
  const params = [...Object.values(fields), userId];
  const sql = `UPDATE fanfarons SET ${setClause} WHERE id = ?`;

  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        console.error('Error updating profile:', err.message);
        if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('.email')) {
          return reject(new Error('Cet email est déjà utilisé.'));
        }
        return reject(err);
      }
      findFanfaronById(userId)
        .then(user => resolve(user))
        .catch(fetchErr => reject(fetchErr));
    });
  });
}

module.exports = {
  findFanfaronByEmail,
  findFanfaronBySurnom,
  findFanfaronById,
  comparePassword,
  createFanfaron,
  getCurrentPresident,
  updateProfile
};