const contratService = require('../services/contratService');

const contratsController = {
  /**
   * GET /api/contrats/upcoming
   */
  getUpcomingContratsApi: async (req, res) => {
      try {
          const contrats = await contratService.listUpcoming();
          res.status(200).json({ success: true, data: contrats });
      } catch (error) {
          console.error("Failed to get upcoming contrats:", error);
          res.status(500).json({ success: false, message: 'Failed to retrieve upcoming contrats' });
      }
  },

  /**
   * GET /api/contrats/past
   */
  getPastContratsApi: async (req, res) => {
      try {
          const limit = parseInt(req.query.limit, 10) || 3; // Default limit is 3
          const contrats = await contratService.listPast(limit);
          res.status(200).json({ success: true, data: contrats });
      } catch (error) {
          console.error("Failed to get past contrats:", error);
          res.status(500).json({ success: false, message: 'Failed to retrieve past contrats' });
      }
  },


  /**
   * GET /api/contrats/
   */
  getAllContrats: async (req, res) => {
    try {
      const contrats = await contratService.listAll();
      return res.status(200).json({ success: true, data:contrats });
    } catch (error) {
      console.error('Controller getPastContrats error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * POST /api/contrats
   */
  addContrat: async (req, res) => {
    try {
      const { date, lieu, description } = req.body;
      const newContrat = await contratService.addContrat({ date, lieu, description });
      return res.status(201).json({ success: true, contrat: newContrat });
    } catch (error) {
      console.error('Controller addContrat error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * PUT /api/contrats/:id
   */
  updateContrat: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { date, lieu, description } = req.body;
      const result = await contratService.updateContrat(id, { date, lieu, description });
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      console.error('Controller updateContrat error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * DELETE /api/contrats/:id
   */
  deleteContrat: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await contratService.deleteContrat(id);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      console.error('Controller deleteContrat error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = contratsController;
