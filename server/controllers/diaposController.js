const diapoService = require('../services/diapoService');

const diaposController = {
  /**
   * GET /          (public)  → 5 dernières diapos
   * GET /ordered   (admin)   → toutes les diapos (flag all=true injecté par la route)
   *
   * ?order=random  → tirage aléatoire
   * ?limit=N       → limite personnalisée (ignorée si all=true)
   */
  async listDiapos(req, res) {
    try {
      const { order, limit, all } = req.query;

      const opts = {
        order: order === 'random' ? 'random' : 'desc',
        limit: all === 'true' ? undefined
                              : (limit ? parseInt(limit, 10) : 5),
      };

      const diapos = await diapoService.list(opts);
      return res.status(200).json(diapos);
    } catch (err) {
      console.error('[listDiapos]', err);
      res.status(500).json({ message: 'Unable to fetch diapos' });
    }
  },

  async addDiapo(req, res) {
    try {
      const fichier = req.file ? req.file.filename : null;
      const { description } = req.body;
      const newDiapo = await diapoService.addDiapo({ fichier, description });
      res.status(201).json(newDiapo);
    } catch (err) {
      console.error('[addDiapo]', err);
      res.status(500).json({ message: err.message });
    }
  },

  async updateDiapo(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const fichier = req.file ? req.file.filename : null;
      const { description } = req.body;
      const updated = await diapoService.updateDiapo(id, { fichier, description });
      res.status(200).json(updated);
    } catch (err) {
      console.error('[updateDiapo]', err);
      res.status(500).json({ message: err.message });
    }
  },

  async deleteDiapo(req, res) {
    try {
      const id = parseInt(req.params.id, 10);
      const result = await diapoService.deleteDiapo(id);
      res.status(200).json(result);
    } catch (err) {
      console.error('[deleteDiapo]', err);
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = diaposController;
