const diapoRepo = require('../repositories/diapoRepository');

const BASE_URL = process.env.REACT_APP_RESTAPI_SERVER_URI;
const buildImageUrl = (fichier) =>
  `${BASE_URL}/public/uploads/carousel/${fichier}`;

const addImageUrl = (diapo) => ({
  ...diapo,
  imageUrl: buildImageUrl(diapo.fichier),
});

const diapoService = {
  async getAllDiapos() {
    const diapos = await diapoRepo.findAll();
    return diapos.map(addImageUrl);
  },

  async getLatestDiapos(limit = 5) {
    const diapos = await diapoRepo.findLatest(limit);
    return diapos.map(addImageUrl);
  },

  async getRandomDiapo() {
    const diapo = await diapoRepo.findRandom();
    return diapo ? addImageUrl(diapo) : null;
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
