const db = require('../database');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10; // Cost factor for bcrypt hashing

/**
 * Finds a fanfaron by their unique email.
 * @param {string} email 
 * @returns {Promise<object|null>} Fanfaron object including password_hash and roles, or null if not found.
 */
function findFanfaronByEmail(email) {
    return new Promise((resolve, reject) => {
        if (!email) return resolve(null);
        const sql = "SELECT * FROM fanfarons WHERE email = ?";
        db.get(sql, [email], (err, row) => {
            if (err) {
                console.error("Error finding fanfaron by email:", err.message);
                reject(err);
            } else {
                resolve(row); // Returns the row object or undefined if not found
            }
        });
    });
}

/**
 * Finds a fanfaron by their unique surnom.
 * @param {string} surnom 
 * @returns {Promise<object|null>} Fanfaron object including password_hash and roles, or null if not found.
 */
function findFanfaronBySurnom(surnom) {
    return new Promise((resolve, reject) => {
        if (!surnom) return resolve(null);
        const sql = "SELECT * FROM fanfarons WHERE surnom = ?";
        db.get(sql, [surnom], (err, row) => {
            if (err) {
                console.error("Error finding fanfaron by surnom:", err.message);
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

/**
 * Finds a fanfaron by their ID.
 * @param {number} id 
 * @returns {Promise<object|null>} Fanfaron object (excluding password_hash for safety) or null.
 */
function findFanfaronById(id) {
    return new Promise((resolve, reject) => {
        if (!id) return resolve(null);
        // Exclude password_hash when fetching by ID for general use
        const sql = "SELECT id, surnom, prenom, nom, instrument, promo, bureau, tel, email, photo, description, roles FROM fanfarons WHERE id = ?";
        db.get(sql, [id], (err, row) => {
            if (err) {
                console.error("Error finding fanfaron by ID:", err.message);
                reject(err);
            } else {
                resolve(row);
            }
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
    if (!plainPassword || !hashedPassword) {
        return false;
    }
    return await bcrypt.compare(plainPassword, hashedPassword);
}

/**
 * Creates a new fanfaron (e.g., by an admin).
 * Hashes the password before insertion.
 * @param {object} fanfaronData - Object containing fanfaron details (surnom, email, plainPassword, promo, etc.)
 * @returns {Promise<object>} The newly created fanfaron object (excluding password_hash).
 */
async function createFanfaron(fanfaronData) {
    // Basic validation
    if (!fanfaronData || !fanfaronData.surnom || !fanfaronData.email || !fanfaronData.plainPassword) {
        throw new Error('Missing required fields (surnom, email, plainPassword) for creating fanfaron.');
    }

    const hashedPassword = await bcrypt.hash(fanfaronData.plainPassword, SALT_ROUNDS);
    
    // Ensure roles is a string (e.g., 'fanfaron' or 'fanfaron,admin')
    const roles = fanfaronData.roles || 'fanfaron'; 

    const sql = `
        INSERT INTO fanfarons 
            (surnom, prenom, nom, instrument, promo, bureau, tel, email, photo, description, password_hash, roles)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
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
        roles
    ];

    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) { // Use function() to access this.lastID
            if (err) {
                console.error("Error creating fanfaron:", err.message);
                // Provide more specific error for unique constraints
                if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('.email')) {
                    return reject(new Error(`Email already exists: ${fanfaronData.email}`));
                }
                 if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('.surnom')) {
                    return reject(new Error(`Surnom already exists: ${fanfaronData.surnom}`));
                }
                reject(err);
            } else {
                // Return the created user data (fetch it again to exclude hash)
                findFanfaronById(this.lastID)
                    .then(newUser => resolve(newUser))
                    .catch(fetchErr => reject(fetchErr));
            }
        });
    });
}

/**
 * Finds the current president.
 * Assumes the president has "president" in their 'bureau' field.
 * Returns the one with the highest ID if multiple are found.
 * @returns {Promise<object|null>} President's details (surnom, prenom, nom, email) or null.
 */
function getCurrentPresident() {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT id, surnom, prenom, nom, email, bureau, promo, tel
            FROM fanfarons 
            WHERE lower(bureau) LIKE '%president%'
            ORDER BY id DESC 
            LIMIT 1
        `;
        db.get(sql, [], (err, row) => {
            if (err) {
                console.error("Error finding current president:", err.message);
                reject(err);
            } else {
                resolve(row); // Returns the row object or undefined if not found
            }
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
    if (!userId) throw new Error('User ID is required for profile update');
    // Only allow nom, prenom, email, and tel (map telephone to tel)
    const dbUpdates = {};
    if (updates.nom !== undefined) dbUpdates.nom = updates.nom;
    if (updates.prenom !== undefined) dbUpdates.prenom = updates.prenom;
    if (updates.email !== undefined) dbUpdates.email = updates.email;
    if (updates.telephone !== undefined) dbUpdates.tel = updates.telephone;
    
    if (Object.keys(dbUpdates).length === 0) {
        throw new Error('No valid fields to update');
    }
    // Build SQL
    const setClause = Object.keys(dbUpdates).map(f => `${f} = ?`).join(', ');
    const params = [...Object.values(dbUpdates), userId];
    const sql = `UPDATE fanfarons SET ${setClause} WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.run(sql, params, function(err) {
            if (err) {
                console.error('Error updating user profile:', err.message);
                if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('.email')) {
                    return reject(new Error('Cet email est déjà utilisé.'));
                }
                return reject(err);
            }
            // Log the update
            console.log(`User ${userId} profile updated:`, dbUpdates);
            // Return the updated user (excluding password_hash)
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