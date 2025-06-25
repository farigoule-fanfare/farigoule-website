// server/controllers/adminController.js
const userService = require('../services/userService');
const bcrypt = require('bcryptjs');
const SALT_ROUNDS = 10;  // keep in sync with userService

module.exports = {
  /**
   * POST /admin/fanfarons/:id/setPassword
   * Body: { password: 'newPlaintext' }
   */
  async setPassword(req, res) {
    const { id } = req.params;
    const { password } = req.body;
    if (!password) return res.status(400).json({ success: false, message: 'Password required' });
    try {
      const hash = await bcrypt.hash(password, SALT_ROUNDS);
      await userService.updatePasswordById(Number(id), hash);
      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  /**
   * POST /admin/fanfarons/:id/addAdminRole
   */
  async addAdminRole(req, res) {
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
   * POST /admin/fanfarons/:id/removeAdminRole
   */
  async removeAdminRole(req, res) {
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