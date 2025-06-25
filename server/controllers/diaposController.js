const diapoService = require('../services/diapoService');

module.exports = {

  /**
   * POST /admin/diapos
   */
  async addDiapo(req, res) {
    try {
      const fichier = req.file ? req.file.filename : null;
      const { description } = req.body;
      const newDiapo = await diapoService.addDiapo({ fichier, description });
      return res.status(201).json({ success: true, diapo: newDiapo });
    } catch (error) {
      console.error('Controller addDiapo error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * PUT /admin/diapos/:id
   */
  async updateDiapo(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const fichier = req.file ? req.file.filename : null;
      const { description } = req.body;
      const updatedDiapo = await diapoService.updateDiapo(id, { fichier, description });
      return res.status(200).json({ success: true, diapo: updatedDiapo });
    } catch (error) {
      console.error('Controller updateDiapo error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * DELETE /admin/diapos/:id
   */
  async deleteDiapo(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await diapoService.deleteDiapo(id);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      console.error('Controller deleteDiapo error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
