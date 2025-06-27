const userRepo = require('../repositories/userRepository');

const userService = {
  // SELECT
  findRolesById:    (...a) => userRepo.findRolesById(...a),
  async findAllUsersRoles() {
    const fanfarons = await userRepo.findAllUsersRoles();
    return fanfarons;
   },
  getCurrentPresident: (...a) => userRepo.getCurrentPresident(...a),

  // UPDATE
  updateProfile:       (...a) => userRepo.updateProfile(...a),
  updateRolesById:     (...a) => userRepo.updateRolesById(...a),
};

module.exports = userService;
