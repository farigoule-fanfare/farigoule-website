/**
 * authService – authentication helpers grouped in a single module.
 * ---------------------------------------------------------------------------
 * Style  : Functional (no classes)
 * Exports: authService object
 * Depends: jsonwebtoken, bcryptjs, authRepository
 * ---------------------------------------------------------------------------
 */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const {
  findFanfaronByEmail,
  findFanfaronBySurnom,
  comparePassword,
  updatePasswordById,
  findPasswordHashById,
  getRolesById,
} = require('../repositories/authRepository');

/* ---------------------------------------------------------------------------
 * Constants
 * ------------------------------------------------------------------------- */
const SALT_ROUNDS = Number.parseInt(process.env.SALT_ROUNDS ?? '10', 10);
const JWT_SECRET = process.env.JWT_SECRET ?? '⚠️ CHANGE_ME_IN_PRODUCTION ⚠️';
const JWT_EXPIRY = process.env.JWT_EXPIRY ?? '1h'; // e.g. "1h", "7d"

/* ---------------------------------------------------------------------------
 * Helpers
 * ------------------------------------------------------------------------- */
const signJwt = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
const asyncVerifyJwt = (token) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return reject(
          err.name === 'TokenExpiredError' ? new Error('Token expired') : new Error('Invalid token'),
        );
      }
      resolve(decoded); // { id, surnom, roles, iat, exp }
    });
  });

/* ---------------------------------------------------------------------------
 * authService – public API
 * ------------------------------------------------------------------------- */
const authService = {
  /**
   * Generates a signed JWT from a fanfaron object.
   * @param {object} fanfaron – requires { id, surnom, roles }
   * @returns {string}
   */
  generateToken(fanfaron) {
    const { id, surnom, roles } = fanfaron ?? {};
    if (!id || !surnom || !roles) {
      throw new TypeError('Invalid fanfaron supplied to generateToken');
    }
    return signJwt({ id, surnom, roles });
  },

  /**
   * Decodes and validates a JWT.
   * @param {string} token
   * @returns {Promise<object>} – decoded payload
   */
  verifyToken: asyncVerifyJwt,

  /**
   * Authenticates a user by e‑mail OR surnom and returns { user, token }.
   * @throws {Error & {code: 'MISSING_FIELDS'|'INVALID_CREDENTIALS'}}
   */
  async login(identifier, password) {
    if (!identifier || !password) {
      throw Object.assign(new Error('Email/Surnom and password required'), { code: 'MISSING_FIELDS' });
    }

    const fanfaron =
      (await findFanfaronByEmail(identifier)) || (await findFanfaronBySurnom(identifier));

    const valid = fanfaron && (await comparePassword(password, fanfaron.password_hash));
    if (!valid) {
      throw Object.assign(new Error('Invalid credentials'), { code: 'INVALID_CREDENTIALS' });
    }

    const { password_hash, ...safeUser } = fanfaron;
    return { user: safeUser, token: signJwt(safeUser) };
  },

  /**
   * Admin‑only: force‑set another user’s password.
   */
  async adminSetPassword(adminId, targetUserId, newPw) {
    if (!adminId || !targetUserId || !newPw) {
      throw new Error('adminId, targetUserId, newPw required');
    }
    if (adminId === targetUserId) {
      throw new Error('Use changePassword to modify your own password');
    }
    await updatePasswordById(targetUserId, await bcrypt.hash(newPw, SALT_ROUNDS));
  },

  /**
   * User: change own password.
   */
  async changePassword(userId, currentPw, newPw) {
    if (!userId || !currentPw || !newPw) {
      throw new Error('userId, currentPw, newPw required');
    }

    const currentHash = await findPasswordHashById(userId);
    if (!currentHash) throw new Error('User not found');

    const ok = await bcrypt.compare(currentPw, currentHash);
    if (!ok) throw new Error('Current password incorrect');

    await updatePasswordById(userId, await bcrypt.hash(newPw, SALT_ROUNDS));
  },

  // Pass‑throughs -----------------------------------------------------------
  getRolesById,
};

module.exports = authService;
