const contratService = require('../../services/contratService');

module.exports = {

   /**
   * GET /admin/contrats/
   */
  async getAllContrats(req, res) {
    try {
      const contrats = await contratService.getAllContrats();
      return res.status(200).json({ success: true, data:contrats });
    } catch (error) {
      console.error('Controller getPastContrats error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * POST /admin/contrats
   */
  async addContrat(req, res) {
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
   * PUT /admin/contrats/:id
   */
  async updateContrat(req, res) {
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
   * DELETE /admin/contrats/:id
   */
  async deleteContrat(req, res) {
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


