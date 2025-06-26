const diapoService = require('../services/diapoService');

const diaposController = {
  async listDiapos(req, res) {
    try {
      const diapos = await diapoService.getAllDiapos();
      res.status(200).json({ success: true, data: diapos });
    } catch (err) {
      console.error('[listDiapos]', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve diapos' });
    }
  },

  async listLatestDiapos(req, res) {
    try {
      const limit = parseInt(req.query.limit, 10) || 5;
      const diapos = await diapoService.getLatestDiapos(limit);
      res.status(200).json({ success: true, data: diapos });
    } catch (err) {
      console.error('[listLatestDiapos]', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve diapos' });
    }
  },

  async getRandomDiapo(req, res) {
    try {
      const diapo = await diapoService.getRandomDiapo();
      if (!diapo) {
        return res.status(404).json({ success: false, message: 'No diapos found.' });
      }
      res.status(200).json({ success: true, data: diapo });
    } catch (err) {
      console.error('[getRandomDiapo]', err);
      res.status(500).json({ success: false, message: 'Failed to retrieve diapo' });
    }
  },

  async addDiapo(req, res) {
    try {
      const fichier = req.file ? req.file.filename : null;
      const { description } = req.body;
      const newDiapo = await diapoService.addDiapo({ fichier, description });
      res.status(201).json({ success: true, diapo: newDiapo });
    } catch (err) {
      console.error('[addDiapo]', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async updateDiapo(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const fichier = req.file ? req.file.filename : null;
      const { description } = req.body;
      const updated = await diapoService.updateDiapo(id, { fichier, description });
      res.status(200).json({ success: true, diapo: updated });
    } catch (err) {
      console.error('[updateDiapo]', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async deleteDiapo(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await diapoService.deleteDiapo(id);
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      console.error('[deleteDiapo]', err);
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = diaposController;
