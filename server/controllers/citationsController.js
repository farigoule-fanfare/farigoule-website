const citationService = require('../services/citationService');

const citationsController = {
  /**
   * GET /api/citations/ordered
   */
  getAllCitationsOrdered: async (req, res) => {
    try {
      const citations = await citationService.getAllCitationsWithAuthorsOrdered();
      return res.status(200).json({ success: true, data: citations });
    } catch (error) {
      console.error('Controller getAllCitations error:', error.message);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  /**
   * POST /admin/citations
   */
  addCitation: async (req, res) => {
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
  updateCitation: async (req, res) => {
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
  deleteCitation: async (req, res) => {
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

module.exports = citationsController;

