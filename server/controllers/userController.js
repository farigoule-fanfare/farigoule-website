const userService = require('../services/userService');

const userController = {
  async getCurrentPresident(req, res) {
    try {
      const president = await userService.getCurrentPresident();
      res.status(200).json(president ?? null);
    } catch (e) {
      console.error('[getCurrentPresident]', e);
      res.status(500).json({ message: e.message });
    }
  },

  async listUsersRoles(req, res) {
    try {
      const roles = await userService.getAllUsersRoles();
      res.status(200).json(roles);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  async updateProfile(req, res) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: 'Non authentifié.' });
      }
      const updated = await userService.updateProfile(userId, req.body);
      res.status(200).json(updated);
    } catch (e) {
      console.error('[updateProfile]', e);
      res.status(500).json({ message: e.message });
    }
  },

  async addAdminRole(req, res) {
    try {
      await userService.addAdminRole(Number(req.params.id));
      res.status(200).json({ message: 'Rôle admin ajouté.' });
    } catch (e) {
      const status = e.message === 'User not found' ? 404 : 500;
      res.status(status).json({ message: e.message });
    }
  },

  async removeAdminRole(req, res) {
    try {
      await userService.removeAdminRole(Number(req.params.id));
      res.status(200).json({ message: 'Rôle admin retiré.' });
    } catch (e) {
      const status = e.message === 'User not found' ? 404 : 500;
      res.status(status).json({ message: e.message });
    }
  },
};

module.exports = userController;
