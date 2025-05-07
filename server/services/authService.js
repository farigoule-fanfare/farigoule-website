const jwt = require('jsonwebtoken');

// IMPORTANT: Store your JWT secret securely!
// Use an environment variable (e.g., process.env.JWT_SECRET)
// instead of hardcoding.
// Generate a strong secret key.
const JWT_SECRET = process.env.JWT_SECRET || 'YOUR_FALLBACK_SUPER_SECRET_KEY_CHANGE_ME'; // Replace with env variable
const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h'; // Token expiry time (e.g., 1 hour, 7 days)

/**
 * Generates a JWT for a given fanfaron.
 * @param {object} fanfaron - The fanfaron object (must include id, surnom, roles).
 * @returns {string} The generated JWT.
 */
function generateToken(fanfaron) {
    if (!fanfaron || !fanfaron.id || !fanfaron.surnom || !fanfaron.roles) {
        throw new Error('Invalid fanfaron object for token generation.');
    }

    const payload = {
        id: fanfaron.id,
        surnom: fanfaron.surnom,
        roles: fanfaron.roles // Include roles in the token payload for authorization checks
    };

    const options = {
        expiresIn: JWT_EXPIRY
    };

    try {
        const token = jwt.sign(payload, JWT_SECRET, options);
        return token;
    } catch (error) {
        console.error("Error signing JWT:", error);
        throw new Error('Could not generate token.');
    }
}

/**
 * Verifies a JWT.
 * @param {string} token - The JWT string to verify.
 * @returns {Promise<object>} The decoded token payload if verification is successful.
 * @throws {Error} If verification fails (invalid token, expired, etc.).
 */
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        if (!token) {
            return reject(new Error('No token provided.'));
        }

        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                // Handle specific errors like expiration
                if (err.name === 'TokenExpiredError') {
                    return reject(new Error('Token expired.'));
                }
                console.error("JWT Verification Error:", err.message);
                return reject(new Error('Invalid token.'));
            }
            resolve(decoded); // Decoded payload (e.g., { id, surnom, roles, iat, exp })
        });
    });
}

module.exports = {
    generateToken,
    verifyToken
}; 