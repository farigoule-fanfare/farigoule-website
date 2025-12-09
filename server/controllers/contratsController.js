const contratService = require('../services/contratService');

const contratsController = {
  /** GET /contrats */
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
      res.status(200).json(contrats);
    } catch (e) {
      console.error('Contrats API error:', e);
      res.status(500).json({ message: 'Unable to fetch contrats' });
    }
  },

  /** POST /contrats */
  addContrat: async (req, res) => {
    try {
      const { date, lieu, description } = req.body;
      if (!date || !lieu || !description) {
        return res.status(400).json({ message: 'date, lieu and description are required.' });
      }
      const newContrat = await contratService.addContrat({ date, lieu, description });
      res.status(201).json(newContrat);
    } catch (error) {
      console.error('Controller addContrat error:', error.message);
      res.status(500).json({ message: error.message });
    }
  },

  /** PUT /contrats/:id */
  updateContrat: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { date, lieu, description } = req.body;
      if (!date || !lieu || !description) {
        return res.status(400).json({ message: 'date, lieu and description are required.' });
      }
      const result = await contratService.updateContrat(id, { date, lieu, description });
      res.status(200).json(result);
    } catch (error) {
      console.error('Controller updateContrat error:', error.message);
      res.status(500).json({ message: error.message });
    }
  },

  /** DELETE /contrats/:id */
  deleteContrat: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await contratService.deleteContrat(id);
      res.status(200).json(result);
    } catch (error) {
      console.error('Controller deleteContrat error:', error.message);
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = contratsController;
