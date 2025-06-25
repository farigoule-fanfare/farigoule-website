const fanfaronService = require('../services/fanfaronService');

module.exports = {
  
  /**
   * POST /admin/fanfarons
   */
  async createFanfaron(req, res) {
    try {
      const payload = {
        ...req.body,
        photo: req.file?.filename || null
      };
      const fanfaron = await fanfaronService.createFanfarons(payload);
      res.json({ success: true, data: fanfaron });
      console.log('Fichier reçu :', req.file);

    } catch (error) {
      console.error('adminController.create error:', error);
      res.status(500).json({ success: false, message: 'Erreur création', error: error.message });
    }
  },

  /**
   * PUT /admin/fanfarons/:id
   */
  async updateFanfaron(req, res) {
    try {
      const payload = {
        ...req.body,
        photo: req.file?.filename || null
      };
      const fanfaron = await fanfaronService.updateFanfarons(req.params.id, payload);
      res.json({ success: true, data: fanfaron });
    } catch (error) {
      console.error('adminController.update error:', error);
      res.status(500).json({ success: false, message: 'Erreur mise à jour', error: error.message });
    }
  },

  /**
   * DELETE /admin/fanfarons/:id
   */
  async removeFanfaron(req, res) {
    try {
      await fanfaronService.deleteFanfarons(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('adminController.remove error:', error);
      res.status(500).json({ success: false, message: 'Erreur suppression', error: error.message });
    }
  }
};
