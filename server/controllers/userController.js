const userService = require('../services/userService');

const getAllUsersApi = async (req, res, next) => {
    try {
        const users = await userService.getAllUsers(); // Assuming you'll create this service function
        res.status(200).json({ success: true, data: users });
    } catch (error) {
        console.error("Get all users API error:", error);
        next(error); // Pass to error handling middleware
    }
};

const getCurrentPresidentApi = async (req, res, next) => {
    try {
        const president = await userService.getCurrentPresident();
        if (!president) {
            // It's not necessarily an error if no president is found, 
            // the frontend can handle this. Or return 404 if it should be an error.
            return res.status(200).json({ success: true, data: null, message: "Current president not found." });
        }
        res.status(200).json({ success: true, data: president });
    } catch (error) {
        console.error("Get current president API error:", error);
        next(error);
    }
};

/**
 * Update the authenticated user's profile (nom, prenom, email, telephone only)
 * Uses the surnom from the JWT (req.user.surnom) to identify the user.
 */
const updateProfileApi = async (req, res, next) => {
    try {
        const surnom = req.user && req.user.surnom;
        if (!surnom) {
            console.warn('Profile update: No authenticated user surnom.');
            return res.status(401).json({ success: false, message: 'Non authentifié.' });
        }
        // Find the user by surnom
        const user = await userService.findFanfaronBySurnom(surnom);
        if (!user) {
            console.warn(`Profile update: No user found for surnom ${surnom}`);
            return res.status(404).json({ success: false, message: 'Utilisateur non trouvé.' });
        }
        const { nom, prenom, email, telephone } = req.body;
        // Log the update attempt
        console.log(`User surnom ${surnom} requests profile update:`, { nom, prenom, email, telephone });
        const updatedUser = await userService.updateProfile(user.id, { nom, prenom, email, telephone });
        res.status(200).json({ success: true, data: updatedUser });
    } catch (error) {
        console.error('Profile update error:', error);
        res.status(500).json({ success: false, message: 'Erreur lors de la mise à jour du profil.', error: error.message });
    }
};

module.exports = {
    // registerFanfaronApi,
    // updateFanfaronPasswordApi,
    getAllUsersApi,
    getCurrentPresidentApi,
    updateProfileApi
};
