const authService = require('../services/authService');
const userService = require('../services/userService');

/**
 * Middleware to protect routes.
 * Verifies JWT from cookie, fetches user, and attaches to req.user.
 */
async function protect(req, res, next) {
    const token = req.cookies.authToken;

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        const decoded = await authService.verifyToken(token);
        // Fetch user from DB to ensure they still exist and have up-to-date info
        // The decoded token should contain the user's ID.
        const fanfaron = await userService.findFanfaronById(decoded.id);

        if (!fanfaron) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }

        // Attach fanfaron object (excluding password_hash) to request
        req.user = fanfaron; 
        next();
    } catch (error) {
        console.error('Auth Protect Middleware Error:', error.message);
        if (error.message === 'Token expired.') {
            return res.status(401).json({ message: 'Token expired. Please log in again.' });
        }
        if (error.message === 'Invalid token.') {
             return res.status(401).json({ message: 'Not authorized, token failed verification' });
        }
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
}

/**
 * Middleware to authorize based on user roles.
 * @param {string[]} requiredRoles - Array of roles that are allowed to access the route.
 */
function authorize(requiredRoles) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Not authorized, no user session' });
        }

        // Assuming roles are stored as a comma-separated string in the user object (e.g., "fanfaron,admin")
        const userRoles = req.user.roles ? req.user.roles.split(',').map(role => role.trim()) : [];

        const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

        if (!hasRequiredRole) {
            return res.status(403).json({ 
                message: 'Forbidden, user does not have the required role.',
                requiredOneOf: requiredRoles,
                userRoles: userRoles
            });
        }
        next();
    };
}

module.exports = {
    protect,
    authorize
}; 