// services/diapoService.js
const diapoRepo = require('../repositories/diapoRepository');

const diapoService = {
  getLatestDiapos(limit = 5) {
    return diapoRepo.findLatest(limit);
  },

  getRandomDiapo() {
    return diapoRepo.findRandom();
  },

  getAllDiapos() {
    return diapoRepo.findAll();
  },

  addDiapo(data) {
    // data : { fichier, description }
    return diapoRepo.create(data);
  },

  updateDiapo(id, data) {
    return diapoRepo.update(id, data);
  },

  deleteDiapo(id) {
    return diapoRepo.remove(id);
  },
};

module.exports = diapoService;
