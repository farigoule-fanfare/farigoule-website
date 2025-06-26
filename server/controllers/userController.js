const userService = require('../services/userService');

const userController = {
    getCurrentPresident: async (req, res, next) => {
        try {
            const president = await userService.getCurrentPresident();
            if (!president) {
                // It's not necessarily an error if no president is found,
                // the frontend can handle this. Or return 404 if it should be an error.
                // TODO: c'est une 404
                return res.status(200).json({ success: true, data: null, message: "Current president not found." });
            }
            res.status(200).json({ success: true, data: president });
        } catch (error) {
            console.error("Get current president API error:", error);
            next(error);
        }
    },

    /**
     * Update the authenticated user's profile (nom, prenom, email, telephone only)
     * Uses the surnom from the JWT (req.user.surnom) to identify the user.
     */
    updateProfile: async (req, res, next) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                console.warn('Profile update: No authenticated user id.');
                return res.status(401).json({ success: false, message: 'Non authentifié.' });
            }

            const { nom, prenom, email, telephone } = req.body;

            const updatedUser = await userService.updateProfile(userId, { nom, prenom, email, telephone });
            return res.status(200).json({ success: true, data: updatedUser });
        } catch (error) {
            console.error('Profile update error:', error);
            res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du profil.', error: error.message });
        }
    },

    /**
     * POST api/users/:id/addAdminRole
     */
    addAdminRole: async (req, res) => {
        const { id } = req.params;
        try {
        const user = await userService.findFanfaronById(Number(id));
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        const roles = Array.from(new Set([ ...user.roles, 'admin' ]));
        await userService.updateRolesById(Number(id), roles);
        res.json({ success: true });
        } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
        }
    },
    
    /**
     * POST api/users/:id/removeAdminRole
     */
    removeAdminRole: async (req, res) => {
        const { id } = req.params;
        try {
        const user = await userService.findFanfaronById(Number(id));
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        // never remove admin from yourself: check req.user.id if you have auth middleware
        const filtered = user.roles.filter(r => r !== 'admin');
        await userService.updateRolesById(Number(id), filtered);
        res.json({ success: true });
        } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: err.message });
        }
    },
};

module.exports = userController;
