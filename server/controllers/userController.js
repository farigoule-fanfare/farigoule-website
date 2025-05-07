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

module.exports = {
    // registerFanfaronApi,
    // updateFanfaronPasswordApi,
    getAllUsersApi,
    getCurrentPresidentApi // Export the new controller function
};
