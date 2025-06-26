const authService = require('../services/authService');

const authController = {
    /**
     * Handles user login.
     * Expects { identifier, password } in request body (identifier can be email or surnom).
     */
    handleLogin: async (req, res) => {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            return res.status(400).json({ success:false, message:'Email/Surnom and password are required.' });
        }

        try {
            const { user, token } = await authService.login(identifier, password);
            // cookie + réponse HTTP = responsabilité du controller
            res.cookie('authToken', token, {/* opts */});
            res.status(200).json({ success:true, message:'Login successful', user });
        } catch (err) {
            // le service enverra des erreurs sémantiques ('INVALID_CREDENTIALS', etc.)
            const code = err.code === 'INVALID_CREDENTIALS' ? 401 : 500;
            res.status(code).json({ success:false, message: err.message });
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
        res.status(200).json({ success: true, message: 'Logout successful.' });
    },

    /**
     * Handles checking authentication status.
     * Requires the 'protect' middleware to run first to populate req.user.
     */
    handleCheckAuthStatus: (req, res) => {
        // The 'protect' middleware (to be added later) should populate req.user
        if (req.user) {
            res.status(200).json({ success: true, isAuthenticated: true, user: req.user });
        } else {
            // This case might not be reached if 'protect' middleware strictly enforces login
            res.status(401).json({ success: false, isAuthenticated: false, user: null });
        }
    },

    /**
     * Permet à l’utilisateur authentifié de changer son propre mot de passe.
     * Exige dans le body : { currentPassword, newPassword }
     */
    changePassword: async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        try {
            await authService.changePassword(req.user.id, currentPassword, newPassword);
            res.json({ success: true, message: 'Mot de passe mis à jour.' });
        } catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    },
    
    /**
     * POST api/users/fanfarons/:id/setPassword
     * Body: { password: 'newPlaintext' }
     */
    adminSetPassword: async (req, res) => {
        const { userId: targetUserId, newPassword } = req.body;
        try {
            await authService.adminSetPassword(req.user.id, targetUserId, newPassword);
            res.json({ success: true, message: 'Mot de passe réinitialisé.' });
        } catch (e) {
            res.status(400).json({ success: false, message: e.message });
        }
    },
};

module.exports = authController; 