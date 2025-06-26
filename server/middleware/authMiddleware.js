const authService = require('../services/authService');

/**
 * Middleware de protection :
 * – récupère le JWT (header Bearer OU cookie authToken)
 * – vérifie le token
 * – charge l’utilisateur en DB pour disposer de ses rôles à jour
 * – place l’objet fanfaron (sans password_hash) dans req.user
 */
async function protect(req, res, next) {
  try {
    let token = null;

    // 1) Header : Authorization: Bearer <token>
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2) Fallback : cookie HTTP-only authToken
    if (!token && req.cookies?.authToken) {
      token = req.cookies.authToken;
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    // 3) Vérification du JWT (lance une erreur si invalide / expiré)
    const decoded = await authService.verifyToken(token);

    // 4) On recharge l’utilisateur pour avoir ses rôles à jour
    const fanfaron = await authService.getRolesById(decoded.id);
    if (!fanfaron) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = fanfaron;          // { id, surnom, roles, … }
    next();
  } catch (err) {
    console.error('Auth Protect Middleware Error:', err);
    return res.status(401).json({ message: err.message || 'Not authorized' });
  }
}

/**
 * Middleware d’autorisation par rôle.
 * @param {string[]} requiredRoles – rôles acceptés (ex. ['admin'])
 */
function authorize(requiredRoles = []) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user session' });
    }

    // Les rôles sont stockés en array ou CSV ; on les convertit en array
    const userRoles = Array.isArray(req.user.roles)
      ? req.user.roles
      : String(req.user.roles || '').split(',');

    const ok = requiredRoles.some((role) => userRoles.includes(role));
    if (!ok) {
      return res.status(403).json({
        message: 'Forbidden, user does not have the required role.',
        requiredOneOf: requiredRoles,
        userRoles,
      });
    }
    next();
  };
}

module.exports = { protect, authorize };
