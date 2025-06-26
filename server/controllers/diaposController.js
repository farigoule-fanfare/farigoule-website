const diapoService = require('../services/diapoService');

const diaposController = {
  /**
   * GET /api/diapos/
   */
  getAllDiaposApi: async (req, res) => {
      try {
          const diapos = await diapoService.getAllDiapos();
          // Prepend the base URL for static files to the fichier names
          const diaposWithUrls = diapos.map(d => ({
              ...d,
              imageUrl: `${process.env.REACT_APP_RESTAPI_SERVER_URI}/public/uploads/carousel/${d.fichier}`
          }));
          res.status(200).json({ success: true, data: diaposWithUrls });
      } catch (error) {
          console.error("Failed to get all diapos:", error);
          res.status(500).json({ success: false, message: 'Failed to retrieve all diapos' });
      }
  },
  
  /**
   * GET /api/diapos/latest
   */
  getLatestDiaposApi: async (req, res) => {
      try {
          const limit = parseInt(req.query.limit, 10) || 5;
          const diapos = await diapoService.getLatestDiapos(limit);
          const diaposWithUrls = diapos.map(d => ({
              ...d,
              imageUrl: `${process.env.REACT_APP_RESTAPI_SERVER_URI}/public/uploads/carousel/${d.fichier}`
          }));
          res.status(200).json({ success: true, data: diaposWithUrls });
      } catch (error) {
          console.error("Failed to get latest diapos:", error);
          res.status(500).json({ success: false, message: 'Failed to retrieve diapos' });
      }
  },

  /**
   * GET /api/diapos/random
   */
  getRandomDiapoApi: async (req, res) => {
      try {
          const diapo = await diapoService.getRandomDiapo();
          if (!diapo) {
              return res.status(404).json({ success: false, message: 'No diapos found.' });
          }
          // Prepend the base URL for static files to the fichier name
          const diapoWithUrl = {
              ...diapo,
              imageUrl: `${process.env.REACT_APP_RESTAPI_SERVER_URI}/public/uploads/carousel/${diapo.fichier}`
          };
          res.status(200).json({ success: true, data: diapoWithUrl });
      } catch (error) {
          console.error("Failed to get random diapo:", error);
          res.status(500).json({ success: false, message: 'Failed to retrieve random diapo' });
      }
  },

  /**
   * POST /api/diapos
   */
  addDiapo: async (req, res) => {
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
   * PUT /api/diapos/:id
   */
  updateDiapo: async (req, res) =>{
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
   * DELETE /api/diapos/:id
   */
  deleteDiapo: async (req, res) => {
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

module.exports = diaposController;