const userRepo = require('../repositories/userRepository');

const userService = {
  // SELECT
  findFanfaronById:    (...a) => userRepo.findFanfaronById(...a),
  getCurrentPresident: (...a) => userRepo.getCurrentPresident(...a),

  // UPDATE
  updateProfile:       (...a) => userRepo.updateProfile(...a),
  updatePasswordById:  (...a) => userRepo.updatePasswordById(...a),
  updateRolesById:     (...a) => userRepo.updateRolesById(...a),
};

module.exports = userService;
