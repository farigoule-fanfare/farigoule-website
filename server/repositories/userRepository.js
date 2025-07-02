const { _native: db } = require('../services/databaseService');

/** Utilitaire : transforme le champ JSON rôles en tableau */
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
  async findRolesById(id) {
    if (!id) return null;
    const row = db
      .prepare('SELECT id, roles FROM fanfarons WHERE id = ?')
      .get(id);
    return row ? { ...row, roles: parseRoles(row.roles) } : null;
  },

  async findFanfaronById(id) {
    if (!id) return null;
    const row = db
      .prepare('SELECT id, nom, prenom, email, tel FROM fanfarons WHERE id = ?')
      .get(id);
    return row ? { ...row, roles: parseRoles(row.roles) } : null;
  },

  async findAllUsersRoles() {
    const rows = db
      .prepare('SELECT id, surnom, promo, roles FROM fanfarons')
      .all();
    return rows.map(r => ({ ...r, roles: parseRoles(r.roles) }));
  },

  async getCurrentPresident() {
    return db
      .prepare(`
        SELECT surnom, prenom, nom, email, tel
          FROM fanfarons
         WHERE lower(bureau) LIKE '%president%'
         ORDER BY promo DESC
         LIMIT 1`)
      .get();
  },

  /* ---------- UPDATE ---------- */
  async updateProfile(userId, updates) {
    if (!userId) throw new Error('User ID is required');

    const fields = {};
    if (updates.nom !== undefined) fields.nom = updates.nom;
    if (updates.prenom !== undefined) fields.prenom = updates.prenom;
    if (updates.email !== undefined) fields.email = updates.email;
    if (updates.telephone !== undefined) fields.tel = updates.telephone;
    if (!Object.keys(fields).length)
      throw new Error('No valid fields');

    const setClause = Object.keys(fields)
      .map(f => `${f} = ?`)
      .join(', ');
    const sql = `UPDATE fanfarons SET ${setClause} WHERE id = ?`;
    const params = [...Object.values(fields), userId];

    try {
      const { changes } = db.prepare(sql).run(...params);
      if (changes === 0) return null;
    } catch (err) {
      if (
        err.code === 'SQLITE_CONSTRAINT' &&
        String(err.message).includes('.email')
      ) {
        throw new Error('Cet email est déjà utilisé.');
      }
      throw err;
    }

    return userRepository.findFanfaronById(userId);
  },

  async updateRolesById(userId, rolesArray) {
    db.prepare('UPDATE fanfarons SET roles = ? WHERE id = ?')
      .run(JSON.stringify(rolesArray), userId);
  },
};

module.exports = userRepository;
