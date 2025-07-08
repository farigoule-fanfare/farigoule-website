const diapoRepo = require('../repositories/diapoRepository');
const buildImageUrl = (fichier) => `/public/uploads/carousel/${fichier}`;


const addImageUrl = (diapo) => ({
  ...diapo,
  imageUrl: buildImageUrl(diapo.fichier),
});

const diapoService = {
  /**
   * Récupère des diapos selon l’ordre et la limite demandés.
   * @param {Object}   opts
   * @param {'random'|'desc'} [opts.order='random']  Tri aléatoire ou décroissant.
   * @param {number}   [opts.limit=5]               Nombre max de lignes (undefined → sans limite).
   */
  async list({ order = 'random', limit } = {}) {
    const diapos = await diapoRepo.find({ order, limit });
    return diapos.map(addImageUrl);
  },

  async addDiapo({ fichier, description }) {
    const created = await diapoRepo.create({ fichier, description });
    return addImageUrl(created);
  },

  async updateDiapo(id, { fichier, description }) {
    const updated = await diapoRepo.update(id, { fichier, description });
    return addImageUrl(updated);
  },

  deleteDiapo(id) {
    return diapoRepo.remove(id);
  },
};

module.exports = diapoService;
