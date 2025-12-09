const authService = require('../services/authService');

const authController = {
  handleLogin: async (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/Surnom and password are required.' });
    }

    try {
      const { user, token } = await authService.login(identifier, password);
      res.cookie('authToken', token, { /* options */ });
      res.status(200).json({ message: 'Login successful', user });
    } catch (err) {
      const code = err.code === 'INVALID_CREDENTIALS' ? 401 : 500;
      res.status(code).json({ message: err.message });
    }
  },

  handleLogout: (req, res) => {
    res.cookie('authToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0)
    });
    res.status(200).json({ message: 'Logout successful.' });
  },

  handleCheckAuthStatus: (req, res) => {
    if (req.user) {
      res.status(200).json({ isAuthenticated: true, user: req.user });
    } else {
      res.status(401).json({ isAuthenticated: false, user: null });
    }
  },

  changePassword: async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'currentPassword and newPassword are required.' });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({ message: 'The new password must be different from the current password.' });
    }

    try {
      await authService.changePassword(userId, currentPassword, newPassword);
      res.status(200).json({ message: 'Mot de passe mis à jour.' });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  adminSetPassword: async (req, res) => {
    const { userId: targetUserId, newPassword } = req.body;
    const adminId = req.user?.id;

    if (!adminId) {
      return res.status(401).json({ message: 'Authentication required.' });
    }
    if (!targetUserId || !newPassword) {
      return res.status(400).json({ message: 'userId and newPassword are required.' });
    }
    const targetId = Number(targetUserId);
    if (!Number.isInteger(targetId) || targetId <= 0) {
      return res.status(400).json({ message: 'userId must be a positive integer.' });
    }
    if (targetId === Number(adminId)) {
      return res.status(400).json({ message: 'Admins cannot reset their own password with adminSetPassword.' });
    }

    try {
      await authService.adminSetPassword(adminId, targetId, newPassword);
      res.status(200).json({ message: 'Mot de passe réinitialisé.' });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
};

module.exports = authController;
