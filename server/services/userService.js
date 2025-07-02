const userRepo = require('../repositories/userRepository');
const ALLOWED = new Set(['nom', 'prenom', 'email', 'telephone']);

const userService = {
  /* ---------- READ ---------- */
  getCurrentPresident: () => userRepo.getCurrentPresident(),
  getAllUsersRoles:    () => userRepo.findAllUsersRoles(),
  findRolesById:       (id) => userRepo.findRolesById(id),

  /* ---------- UPDATE PROFIL ---------- */
  async updateProfile(id, updates) {
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(
        ([k, v]) => ALLOWED.has(k) && v !== undefined
      )
    );
    if (!Object.keys(filtered).length)
      throw new Error('Aucun champ valide fourni.');

    try {
      await userRepo.updateProfile(id, filtered);
    } catch (e) {
      if (e.message.includes('email') && e.code === 'SQLITE_CONSTRAINT')
        throw new Error('Cet e-mail est déjà utilisé.');
      throw e;
    }
    return userRepo.findFanfaronById(id);            // retourne l’utilisateur à jour
  },

  /* ---------- UPDATE RÔLES ---------- */
  async addAdminRole(id) {
    const user = await userRepo.findRolesById(id);
    if (!user) throw new Error('Utilisateur introuvable.');

    const roles = Array.from(new Set([...user.roles, 'admin']));
    await userRepo.updateRolesById(id, roles);
    return { ...user, roles };
  },

  async removeAdminRole(id) {
    const user = await userRepo.findRolesById(id);
    if (!user) throw new Error('Utilisateur introuvable.');

    const roles = user.roles.filter(r => r !== 'admin');
    await userRepo.updateRolesById(id, roles);
    return { ...user, roles };
  },
};

module.exports = userService;
