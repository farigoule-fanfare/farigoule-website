const userService = require('../services/userService');

const userController = {
  async getCurrentPresident(req, res) {
    try {
      const president = await userService.getCurrentPresident();
      res.json({ success: true, data: president ?? null });
    } catch (e) {
      console.error('[getCurrentPresident]', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  async listUsersRoles(req, res) {
    try {
      const roles = await userService.getAllUsersRoles();
      res.json({ success: true, data: roles });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Non authentifié.' });
      }
      const updated = await userService.updateProfile(userId, req.body);
      res.json({ success: true, data: updated });
    } catch (e) {
      console.error('[updateProfile]', e);
      res.status(500).json({ success: false, message: e.message });
    }
  },

  async addAdminRole(req, res) {
    try {
      await userService.addAdminRole(Number(req.params.id));
      res.json({ success: true });
    } catch (e) {
      const status = e.message === 'User not found' ? 404 : 500;
      res.status(status).json({ success: false, message: e.message });
    }
  },

  async removeAdminRole(req, res) {
    try {
      await userService.removeAdminRole(Number(req.params.id));
      res.json({ success: true });
    } catch (e) {
      const status = e.message === 'User not found' ? 404 : 500;
      res.status(status).json({ success: false, message: e.message });
    }
  },
};

module.exports = userController;
