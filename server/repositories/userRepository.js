const { _native: db } = require('../services/databaseService');

/** Utilitaires **/
function parseRoles(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function runUpdate(id, fields) {
  if (!id) throw new Error('id manquant');
  if (!Object.keys(fields).length) throw new Error('Aucun champ à mettre à jour');

  const setClause = Object.keys(fields).map(k => `${k} = ?`).join(', ');
  const params = [...Object.values(fields), id];
  db.prepare(`UPDATE fanfarons SET ${setClause} WHERE id = ?`).run(...params);
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
  /** Mise à jour des infos « profil » (nom, e-mail, etc.) */
  updateProfile(id, { nom, prenom, email, telephone }) {
    const fields = {};
    if (nom      !== undefined) fields.nom  = nom;
    if (prenom   !== undefined) fields.prenom = prenom;
    if (email    !== undefined) fields.email  = email;
    if (telephone!== undefined) fields.tel    = telephone;
    runUpdate(id, fields);
  },

  /** Remplace complètement le tableau des rôles */
  updateRolesById(id, rolesArray) {
    runUpdate(id, { roles: JSON.stringify(rolesArray ?? []) });
  },
};
module.exports = userRepository;
