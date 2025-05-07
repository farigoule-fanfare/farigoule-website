const userService = require('../services/userService');
const authService = require('../services/authService');

const authController = {
    /**
     * Handles user login.
     * Expects { identifier, password } in request body (identifier can be email or surnom).
     */
    handleLogin: async (req, res) => {
        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({ message: 'Email/Surnom and password are required.' });
        }

        try {
            // Try finding user by email first, then by surnom
            let fanfaron = await userService.findFanfaronByEmail(identifier);
            if (!fanfaron) {
                fanfaron = await userService.findFanfaronBySurnom(identifier);
            }

            if (!fanfaron) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            // Compare password
            const isMatch = await userService.comparePassword(password, fanfaron.password_hash);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid credentials.' });
            }

            // Generate JWT
            const token = authService.generateToken(fanfaron);

            // Set JWT in HTTP-only cookie
            res.cookie('authToken', token, {
                httpOnly: true,       // Cannot be accessed by client-side JS
                secure: process.env.NODE_ENV === 'production', // Send only over HTTPS in production
                sameSite: 'strict',   // Helps prevent CSRF
                maxAge: 60 * 60 * 1000 // 1 hour expiry (matches JWT expiry for consistency)
                // path: '/' // Optional: restrict cookie path if needed
            });

            // Send back user info (excluding password hash)
            const { password_hash, ...fanfaronInfo } = fanfaron; 
            res.status(200).json({ message: 'Login successful', user: fanfaronInfo });

        } catch (error) {
            console.error("Login Error:", error);
            res.status(500).json({ message: 'Internal server error during login.' });
        }
    },

    /**
     * Handles user logout.
     */
    handleLogout: (req, res) => {
        // Clear the authentication cookie
        res.cookie('authToken', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            expires: new Date(0) // Set expiry date to the past
        });
        res.status(200).json({ message: 'Logout successful.' });
    },

    /**
     * Handles checking authentication status.
     * Requires the 'protect' middleware to run first to populate req.user.
     */
    handleCheckAuthStatus: (req, res) => {
        // The 'protect' middleware (to be added later) should populate req.user
        if (req.user) {
            res.status(200).json({ isAuthenticated: true, user: req.user });
        } else {
            // This case might not be reached if 'protect' middleware strictly enforces login
            res.status(401).json({ isAuthenticated: false, user: null });
        }
    }
};

module.exports = authController; 