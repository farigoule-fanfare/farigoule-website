const fanfaronService = require('../services/fanfaronService');

const fanfaronsController = {
  listFanfarons: async (req, res) => {
    try {
      const fanfarons = await fanfaronService.getAllFanfarons();
      res.status(200).json(fanfarons);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  listFanfaronsAnnuaire: async (req, res) => {
    try {
      const fanfarons = await fanfaronService.getAllFanfaronsAnnuaire();
      res.status(200).json(fanfarons);
    } catch (e) {
      res.status(500).json({ message: e.message });
    }
  },

  createFanfaron: async (req, res) => {
    try {
      const payload = { ...req.body, photo: req.file?.filename || null };
      const fanfaron = await fanfaronService.createFanfarons(payload);
      res.status(201).json(fanfaron);
    } catch (error) {
      console.error('[createFanfaron]', error);
      res.status(500).json({ message: error.message });
    }
  },

  updateFanfaron: async (req, res) => {
    try {
      const payload = { ...req.body, photo: req.file?.filename || null };
      const fanfaron = await fanfaronService.updateFanfarons(req.params.id, payload);
      res.status(200).json(fanfaron);
    } catch (error) {
      console.error('[updateFanfaron]', error);
      res.status(500).json({ message: error.message });
    }
  },

  removeFanfaron: async (req, res) => {
    try {
      await fanfaronService.deleteFanfarons(req.params.id);
      res.status(200).json({ message: 'Suppression réussie' });
    } catch (error) {
      console.error('[removeFanfaron]', error);
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = fanfaronsController;
