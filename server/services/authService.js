const authRepo = require('../repositories/authRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

// IMPORTANT: Store your JWT secret securely, e.g. in an environment variable.
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_FALLBACK_SUPER_SECRET_KEY_CHANGE_ME';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h'; // e.g. "1h", "7d"

/**
 * AuthService – gathers all authentication helpers in a single object
 * following the same pattern as userService.
 */
const authService = {
  /**
   * Generates a signed JWT for the given fanfaron.
   * @param {object} fanfaron - Must contain { id, surnom, roles }.
   * @returns {string} Signed JWT.
   */
  generateToken: (fanfaron) => {
    if (!fanfaron || !fanfaron.id || !fanfaron.surnom || !fanfaron.roles) {
      throw new Error('Invalid fanfaron object for token generation.');
    }

    const payload = {
      id: fanfaron.id,
      surnom: fanfaron.surnom,
      roles: fanfaron.roles,
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  },

  /**
   * Verifies a JWT and resolves with its decoded payload.
   * @param {string} token - JWT string.
   * @returns {Promise<object>} Decoded payload if valid.
   */
  verifyToken: (token) => new Promise((resolve, reject) => {
    if (!token) {
      return reject(new Error('No token provided.'));
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return reject(new Error('Token expired.'));
        }
        return reject(new Error('Invalid token.'));
      }
      resolve(decoded); // { id, surnom, roles, iat, exp }
    });
  }),

  adminSetPassword: async (adminId, targetUserId, newPw) =>{
    if (!adminId || !targetUserId || !newPw)
      throw new Error('adminId, targetUserId, newPw required');

    // a) empêcher l’admin de passer par ici pour lui-même
    if (adminId === targetUserId)
      throw new Error('Use changePassword to modify your own password');

    // b) hash et update
    const newHash = await bcrypt.hash(newPw, SALT_ROUNDS);
    await authRepo.updatePasswordById(targetUserId, newHash);
  },

  changePassword: async (userId, currentPw, newPw) => {
    if (!userId || !currentPw || !newPw)
      throw new Error('userId, currentPw, newPw required');

    // a) récupérer le hash actuel
    const currentHash = await authRepo.findPasswordHashById(userId);
    if (!currentHash) throw new Error('User not found');

    // b) vérifier l’ancien mot de passe
    const ok = await bcrypt.compare(currentPw, currentHash);
    if (!ok) throw new Error('Current password incorrect');

    // c) hasher le nouveau mot de passe et stocker
    const newHash = await bcrypt.hash(newPw, SALT_ROUNDS);
    await authRepo.updatePasswordById(userId, newHash);
  },

  findFanfaronById:    (...a) => authRepo.findFanfaronById(...a),
  findFanfaronByEmail: (...a) => authRepo.findFanfaronByEmail(...a),
  findFanfaronBySurnom: (...a) => authRepo.findFanfaronBySurnom(...a),
  comparePassword:     (...a) => authRepo.comparePassword(...a),
};

module.exports = authService;
