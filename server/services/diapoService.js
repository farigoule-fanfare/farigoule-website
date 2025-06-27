const diapoRepo = require('../repositories/diapoRepository');

const BASE_URL = process.env.REACT_APP_RESTAPI_SERVER_URI;
const buildImageUrl = (fichier) =>
  `${BASE_URL}/public/uploads/carousel/${fichier}`;


const addImageUrl = (diapo) => ({
  ...diapo,
  imageUrl: buildImageUrl(diapo.fichier),
});

function list({ order = 'desc', limit } = {}) {
  return diapoRepo.find({ order, limit }).then((d) => d.map(addImageUrl));
}

const diapoService = {
  /**
   * Récupère des diapos selon l’ordre et la limite demandés.
   * @param {Object}   opts
   * @param {'random'|'desc'} [opts.order='random']  Tri aléatoire ou décroissant.
   * @param {number}   [opts.limit=5]               Nombre max de lignes (undefined → sans limite).
   */
  async list({ order = 'random', limit = 5 } = {}) {
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
