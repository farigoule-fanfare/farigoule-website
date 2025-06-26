// services/userService.js
const userRepo = require('../repositories/userRepository');

const userService = {
  // SELECT
  findFanfaronByEmail: (...a) => userRepo.findFanfaronByEmail(...a),
  findFanfaronBySurnom: (...a) => userRepo.findFanfaronBySurnom(...a),
  findFanfaronById:    (...a) => userRepo.findFanfaronById(...a),
  getCurrentPresident: (...a) => userRepo.getCurrentPresident(...a),
  listAllUsers:        (...a) => userRepo.listAllUsers(...a),

  // INSERT
  createFanfaron:      (...a) => userRepo.createFanfaron(...a),

  // UPDATE
  updateProfile:       (...a) => userRepo.updateProfile(...a),
  updatePasswordById:  (...a) => userRepo.updatePasswordById(...a),
  updateRolesById:     (...a) => userRepo.updateRolesById(...a),

  // UTIL
  comparePassword:     (...a) => userRepo.comparePassword(...a),
};

module.exports = userService;
