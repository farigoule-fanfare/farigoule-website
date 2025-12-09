const authService = require('../services/authService');

const authController = {
  handleLogin: async (req, res) => {
    const { identifier, password } = req.body;

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
    try {
      await authService.changePassword(req.user.id, currentPassword, newPassword);
      res.status(200).json({ message: 'Mot de passe mis à jour.' });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },

  adminSetPassword: async (req, res) => {
    const { userId: targetUserId, newPassword } = req.body;
    try {
      await authService.adminSetPassword(req.user.id, targetUserId, newPassword);
      res.status(200).json({ message: 'Mot de passe réinitialisé.' });
    } catch (e) {
      res.status(400).json({ message: e.message });
    }
  },
};

module.exports = authController;
