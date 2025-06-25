const citationService = require('../../services/citationService');

module.exports = {
  /**
   * POST /admin/citations
   */
  async addCitation(req, res) {
    try {
      const { citation, auteur_id } = req.body;
      const newCitation = await citationService.addCitation({ citation, auteur_id });
      return res.status(201).json({ success: true, citation: newCitation });
    } catch (error) {
      console.error('Controller addCitation error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * PUT /admin/citations/:id
   */
  async updateCitation(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const { citation, auteur_id } = req.body;
      const result = await citationService.updateCitation(id, { citation, auteur_id });
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      console.error('Controller updateCitation error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * DELETE /admin/citations/:id
   */
  async deleteCitation(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await citationService.deleteCitation(id);
      return res.status(200).json({ success: true, ...result });
    } catch (error) {
      console.error('Controller deleteCitation error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
