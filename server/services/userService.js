const userRepo = require('../repositories/userRepository');

const userService = {
  /* ---------- READ ---------- */
  getCurrentPresident: () => userRepo.getCurrentPresident(),
  getAllUsersRoles:    () => userRepo.findAllUsersRoles(),
  findRolesById:       (id) => userRepo.findRolesById(id),

  /* ---------- UPDATE ---------- */
  updateProfile: (userId, { nom, prenom, email, telephone }) =>
    userRepo.updateProfile(userId, { nom, prenom, email, telephone }),

  async addAdminRole(id) {
    const user = await userRepo.findRolesById(id);
    if (!user) throw new Error('User not found');
    const roles = Array.from(new Set([...user.roles, 'admin']));
    return userRepo.updateRolesById(id, roles);
  },

  async removeAdminRole(id) {
    const user = await userRepo.findRolesById(id);
    if (!user) throw new Error('User not found');
    const roles = user.roles.filter((r) => r !== 'admin');
    return userRepo.updateRolesById(id, roles);
  },
};

module.exports = userService;
