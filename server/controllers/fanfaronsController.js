const fanfaronService = require('../services/fanfaronService');

const fanfaronsController = {
  listFanfarons: async (req, res) => {
    try {
      const fanfarons = await fanfaronService.getAllFanfarons();
      res.json({ success: true, data: fanfarons });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  },

  getAllFanfaronsAnnuaire: async (req, res) => {
    try {
      const fanfarons = await fanfaronService.getAllFanfaronsAnnuaire();
      res.json({ success: true, data: fanfarons });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  },

  createFanfaron: async (req, res) => {
    try {
      const payload = { ...req.body, photo: req.file?.filename || null };
      const fanfaron = await fanfaronService.createFanfarons(payload);
      res.json({ success: true, data: fanfaron });
    } catch (error) {
      console.error('[createFanfaron]', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  updateFanfaron: async (req, res) => {
    try {
      const payload = { ...req.body, photo: req.file?.filename || null };
      const fanfaron = await fanfaronService.updateFanfarons(req.params.id, payload);
      res.json({ success: true, data: fanfaron });
    } catch (error) {
      console.error('[updateFanfaron]', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },

  removeFanfaron: async (req, res) => {
    try {
      await fanfaronService.deleteFanfarons(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error('[removeFanfaron]', error);
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

module.exports = fanfaronsController;
