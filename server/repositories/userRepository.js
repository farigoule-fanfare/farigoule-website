const db = require('../services/databaseService');
const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

/** Utilitaire : transforme le champ JSON rôles en tableau */
function parseRoles(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const userRepository = {
  /* ---------- SELECT ---------- */

  findFanfaronByEmail(email) {
    if (!email) return Promise.resolve(null);
    const sql = 'SELECT * FROM fanfarons WHERE email = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [email], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        row.roles = parseRoles(row.roles);
        resolve(row);
      });
    });
  },

  findFanfaronBySurnom(surnom) {
    if (!surnom) return Promise.resolve(null);
    const sql = 'SELECT * FROM fanfarons WHERE surnom = ?';
    return new Promise((resolve, reject) => {
      db.get(sql, [surnom], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        row.roles = parseRoles(row.roles);
        resolve(row);
      });
    });
  },

  findFanfaronById(id) {
    if (!id) return Promise.resolve(null);
    const sql = `
      SELECT id, surnom, prenom, nom, instrument, promo, bureau,
             tel, email, photo, description, roles
      FROM fanfarons WHERE id = ?`;
    return new Promise((resolve, reject) => {
      db.get(sql, [id], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        row.roles = parseRoles(row.roles);
        resolve(row);
      });
    });
  },

  getCurrentPresident() {
    const sql = `
      SELECT id, surnom, prenom, nom, email, bureau, promo, tel, roles
      FROM fanfarons
      WHERE lower(bureau) LIKE '%president%'
      ORDER BY id DESC LIMIT 1`;
    return new Promise((resolve, reject) => {
      db.get(sql, [], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        row.roles = parseRoles(row.roles);
        resolve(row);
      });
    });
  },

  listAllUsers() {
    const sql = 'SELECT id, surnom, promo, roles FROM fanfarons';
    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        const users = rows.map(r => ({ ...r, roles: parseRoles(r.roles) }));
        resolve(users);
      });
    });
  },

  /* ---------- INSERT ---------- */

  async createFanfaron(data) {
    if (!data?.surnom || !data.email || !data.plainPassword) {
      throw new Error('Missing required fields (surnom, email, plainPassword)');
    }

    const hashedPassword = await bcrypt.hash(data.plainPassword, SALT_ROUNDS);
    const rolesJson = JSON.stringify(
      Array.isArray(data.roles) ? data.roles : ['fanfaron']
    );

    const sql = `
      INSERT INTO fanfarons
      (surnom, prenom, nom, instrument, promo, bureau,
       tel, email, photo, description, password_hash, roles)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
      data.surnom,
      data.prenom || null,
      data.nom || null,
      data.instrument || null,
      data.promo ? parseInt(data.promo, 10) : null,
      data.bureau || null,
      data.tel || null,
      data.email,
      data.photo || null,
      data.description || null,
      hashedPassword,
      rolesJson,
    ];

    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            if (err.message.includes('.email'))
              return reject(new Error(`Email exists: ${data.email}`));
            if (err.message.includes('.surnom'))
              return reject(new Error(`Surnom exists: ${data.surnom}`));
          }
          return reject(err);
        }
        userRepository
          .findFanfaronById(this.lastID)
          .then(resolve)
          .catch(reject);
      });
    });
  },

  /* ---------- UPDATE ---------- */

  updateProfile(userId, updates) {
    if (!userId) return Promise.reject(new Error('User ID is required'));

    const fields = {};
    if (updates.nom !== undefined) fields.nom = updates.nom;
    if (updates.prenom !== undefined) fields.prenom = updates.prenom;
    if (updates.email !== undefined) fields.email = updates.email;
    if (updates.telephone !== undefined) fields.tel = updates.telephone;
    if (!Object.keys(fields).length) {
      return Promise.reject(new Error('No valid fields'));
    }

    const setClause = Object.keys(fields).map(f => `${f} = ?`).join(', ');
    const params = [...Object.values(fields), userId];
    const sql = `UPDATE fanfarons SET ${setClause} WHERE id = ?`;

    return new Promise((resolve, reject) => {
      db.run(sql, params, function (err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('.email')) {
            return reject(new Error('Cet email est déjà utilisé.'));
          }
          return reject(err);
        }
        userRepository
          .findFanfaronById(userId)
          .then(resolve)
          .catch(reject);
      });
    });
  },

  updatePasswordById(userId, newHash) {
    if (!userId || !newHash) {
      return Promise.reject(new Error('userId et newHash requis'));
    }
    const sql = 'UPDATE fanfarons SET password_hash = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [newHash, userId], err => (err ? reject(err) : resolve()));
    });
  },

  updateRolesById(userId, rolesArray) {
    const sql = 'UPDATE fanfarons SET roles = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [JSON.stringify(rolesArray), userId], err =>
        err ? reject(err) : resolve()
      );
    });
  },

  /* ---------- UTIL ---------- */

  comparePassword(plain, hash) {
    if (!plain || !hash) return Promise.resolve(false);
    return bcrypt.compare(plain, hash);
  },
};

module.exports = userRepository;
