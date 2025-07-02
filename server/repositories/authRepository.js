const { _native: db } = require('../services/databaseService');

/**
 * Transforme le JSON stocké dans la colonne « roles » en tableau JS.
 * Renvoie [] si le champ est vide ou invalide.
 */
function parseRoles(raw) {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

const ALLOWED_FIELDS = new Set(['id', 'email', 'surnom']);

const authRepository = {
  /**
   * Cherche un fanfaron suivant un champ (id, email, …).
   * @param {{ field?: string, value: string|number }}
   * @returns {Promise<object|null>}
   */
    async findFanfaronBy({ field = 'id', value }) {
    if (!ALLOWED_FIELDS.has(field)) {
      throw new Error(`Champ non autorisé : ${field}`);
    }

    const row = db
      .prepare(
        `SELECT id, surnom, nom, prenom, tel, email, roles, password_hash
          FROM fanfarons
          WHERE ${field} = ?
          LIMIT 1`,
      )
      .get(value);

    return row ? { ...row, roles: parseRoles(row.roles) } : null;
  },

  /**
   * Renvoie le hash du mot de passe pour un id donné, ou null si absent.
   */
  async findPasswordHashById(userId) {
    const row = db
      .prepare('SELECT password_hash FROM fanfarons WHERE id = ?')
      .get(userId);
    return row ? row.password_hash : null;
  },

  /**
   * Met à jour le hash du mot de passe ; renvoie true si une ligne est touchée.
   */
  async updatePasswordById(userId, newHash) {
    const { changes } = db
      .prepare(
        'UPDATE fanfarons SET password_hash = ? WHERE id = ?',
      )
      .run(newHash, userId);

    return changes > 0;
  },
}
module.exports = authRepository;