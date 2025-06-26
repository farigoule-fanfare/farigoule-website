const fanfaronService = require('../services/fanfaronService');

const fanfaronsController = {
  /**
   * GET /api/fanfarons/
   */
  getAllFanfaronsApi: async (req, res) => {
        try {
            const fanfarons = await fanfaronService.getAllFanfarons();
            const dataWithUrls = fanfarons.map(f => ({
            ...f,
            photoUrl: `${process.env.REACT_APP_RESTAPI_SERVER_URI}/public/uploads/fanfarons/${f.photo}`
            }));
            res.json({ success: true, data: dataWithUrls });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
  },

  /**
   * GET /api/fanfarons/
   */
  getAllFanfaronsAnnuaire: async (req, res) => {
        try {
            const fanfarons = await fanfaronService.getAllFanfaronsAnnuaire();
            const dataWithUrls = fanfarons.map(f => ({
            ...f,
            photoUrl: `${process.env.REACT_APP_RESTAPI_SERVER_URI}/public/uploads/fanfarons/${f.photo}`
            }));
            res.json({ success: true, data: dataWithUrls });
        } catch (e) {
            res.status(500).json({ success: false, message: e.message });
        }
  },

  /**
   * POST /api/fanfarons
   */
  createFanfaron: async (req, res) => {
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
   * PUT /api/fanfarons/:id
   */
  updateFanfaron: async (req, res) => {
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
   * DELETE /api/fanfarons/:id
   */
  removeFanfaron: async (req, res) => {
    try {
      await fanfaronService.deleteFanfarons(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('adminController.remove error:', error);
      res.status(500).json({ success: false, message: 'Erreur suppression', error: error.message });
    }
  }
};

module.exports = fanfaronsController;