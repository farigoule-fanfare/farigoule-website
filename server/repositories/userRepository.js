const db = require('../services/databaseService');

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
  findRolesById(id) {
    if (!id) return Promise.resolve(null);
    const sql = `
      SELECT id, roles
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

  findAllUsersRoles() {
    const sql = `
      SELECT id, surnom, promo, roles
      FROM fanfarons`
    return new Promise((resolve, reject) => {
      db.all(sql, [], (err, rows) => {
        if (err) return reject(err);
        // parse the JSON‐string roles field into an array
        const users = rows.map(r => ({ 
          ...r, 
          roles: parseRoles(r.roles) 
        }));
        resolve(users);
      });
    });
  },
  
  getCurrentPresident() {
    const sql = `
      SELECT surnom, prenom, nom, email, bureau, promo, tel
      FROM fanfarons
      WHERE lower(bureau) LIKE '%president%'
      ORDER BY promo DESC LIMIT 1`;
    return new Promise((resolve, reject) => {
      db.get(sql, [], (err, row) => {
        if (err) return reject(err);
        if (!row) return resolve(null);
        resolve(row);
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

  updateRolesById(userId, rolesArray) {
    const sql = 'UPDATE fanfarons SET roles = ? WHERE id = ?';
    return new Promise((resolve, reject) => {
      db.run(sql, [JSON.stringify(rolesArray), userId], err =>
        err ? reject(err) : resolve()
      );
    });
  },
};

module.exports = userRepository;
