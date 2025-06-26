// services/authService.js
const jwt = require('jsonwebtoken');

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
};

module.exports = authService;
