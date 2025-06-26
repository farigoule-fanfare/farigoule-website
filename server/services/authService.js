const authRepo = require('../repositories/authRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;

// IMPORTANT: Store your JWT secret securely, e.g. in an environment variable.
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_FALLBACK_SUPER_SECRET_KEY_CHANGE_ME';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h'; // e.g. "1h", "7d"

/**
 * AuthService – gathers all authentication helpers in a single object
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

  /**
   * Authentifie un fanfaron à partir d’un e-mail OU d’un surnom
   * et renvoie { user, token }.
   *
   * @param {string} identifier – e-mail ou surnom
   * @param {string} password   – mot de passe en clair
   * @throws {Error} code: 'MISSING_FIELDS' | 'INVALID_CREDENTIALS'
   */
  login: async (identifier, password) => {
    /* 0. Validation des entrées -------------------------------------------- */
    if (!identifier || !password) {
      throw Object.assign(
        new Error('Email/Surnom et mot de passe requis'),
        { code: 'MISSING_FIELDS' }
      );
    }

    /* 1. Recherche du fanfaron --------------------------------------------- */
    let fanfaron = await authRepo.findFanfaronByEmail(identifier);
    if (!fanfaron) {
      fanfaron = await authRepo.findFanfaronBySurnom(identifier);
    }
    if (!fanfaron) {
      throw Object.assign(
        new Error('Identifiants invalides'),
        { code: 'INVALID_CREDENTIALS' }
      );
    }

    /* 2. Vérification du mot de passe -------------------------------------- */
    const ok = await authRepo.comparePassword(password, fanfaron.password_hash);
    if (!ok) {
      throw Object.assign(
        new Error('Identifiants invalides'),
        { code: 'INVALID_CREDENTIALS' }
      );
    }

    /* 3. Génération du JWT -------------------------------------------------- */
    const token = authService.generateToken(fanfaron);   // utilise generateToken déjà défini

    /* 4. Suppression du hash puis retour ----------------------------------- */
    const { password_hash, ...safeUser } = fanfaron;
    return { user: safeUser, token };
  },

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

  getRolesById:    (...a) => authRepo.getRolesById(...a),
};

module.exports = authService;
