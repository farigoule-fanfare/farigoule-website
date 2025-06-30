const citationService = require('../services/citationService');

const citationsController = {
  /**
   * GET /api/citations
   * ex. /api/citations?order=alpha&author=5&search=truc
   */
  listCitations: async (req, res) => {
    try {
      const { order = 'random', author, search } = req.query;

      const orderOpt = order === 'alpha' ? 'alpha' : 'random';
      const filters = {
        order: orderOpt,
        author: author ? parseInt(author, 10) : undefined,
        search: search?.trim()
      };

      const citations = await citationService.list(filters);
      return res.status(200).json(citations);
    } catch (err) {
      console.error('API citations error:', err);
      return res.status(500).json({ message: 'Unable to fetch citations' });
    }
  },

  /**
   * POST /api/citations
   */
  addCitation: async (req, res) => {
    try {
      const { citation, auteur_id } = req.body;
      const newCitation = await citationService.addCitation({ citation, auteur_id });
      return res.status(201).json(newCitation);
    } catch (error) {
      console.error('Controller addCitation error:', error.message);
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * PUT /api/citations/:id
   */
  updateCitation: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const { citation, auteur_id } = req.body;
      const result = await citationService.updateCitation(id, { citation, auteur_id });

      return res.status(200).json(result);
    } catch (error) {
      console.error('Controller updateCitation error:', error.message);
      return res.status(500).json({ message: error.message });
    }
  },

  /**
   * DELETE /api/citations/:id
   */
  deleteCitation: async (req, res) => {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await citationService.deleteCitation(id);
      return res.status(200).json(result);
    } catch (error) {
      console.error('Controller deleteCitation error:', error.message);
      return res.status(500).json({ message: error.message });
    }
  }
};

module.exports = citationsController;
