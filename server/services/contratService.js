// services/contratService.js
const contratRepo = require('../repositories/contratRepository');

const contratService = {
  listAll() {
    return contratRepo.findAll();
  },

  listUpcoming(limit = 3) {
    return contratRepo.findUpcoming(limit);
  },

  listPast(limit = 3) {
    return contratRepo.findPast(limit);
  },

  addContrat(data) {
    // data : { date, lieu, description }
    return contratRepo.create(data);
  },

  updateContrat(id, data) {
    return contratRepo.update(id, data);
  },

  deleteContrat(id) {
    return contratRepo.remove(id);
  },
};

module.exports = contratService;
