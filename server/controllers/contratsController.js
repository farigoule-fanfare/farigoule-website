const contratService = require('../services/contratService');

const contratsController = {
  /** GET /api/contrats */
  listContrats: async (req, res) => {
    try {
      const { scope, since, until, order, limit } = req.query;
      const filters = {
        scope,
        since: since?.trim(),
        until: until?.trim(),
        order,
        limit: limit ? parseInt(limit, 10) : undefined,
      };
      const contrats = await contratService.list(filters);
      res.status(200).json({ success: true, data: contrats });
    } catch (e) {
      console.error('Contrats API error:', e);
      res.status(500).json({ success: false, message: 'Unable to fetch contrats' });
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
