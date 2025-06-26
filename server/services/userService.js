// services/userService.js
const userRepo = require('../repositories/userRepository');

const userService = {
  // SELECT
  findFanfaronBySurnom: (...a) => userRepo.findFanfaronBySurnom(...a),
  findFanfaronById:    (...a) => userRepo.findFanfaronById(...a),
  getCurrentPresident: (...a) => userRepo.getCurrentPresident(...a),

  // UPDATE
  updateProfile:       (...a) => userRepo.updateProfile(...a),
  updatePasswordById:  (...a) => userRepo.updatePasswordById(...a),
  updateRolesById:     (...a) => userRepo.updateRolesById(...a),
};

module.exports = userService;
