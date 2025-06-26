const fanfaronRepo = require('../repositories/fanfaronRepository');

const fanfaronService = {
  getAllFanfarons() {
    return fanfaronRepo.findAll();
  },

  getAllFanfaronsAnnuaire() {
    return fanfaronRepo.findAllAnnuaire();
  },

  createFanfarons(data) {
    return fanfaronRepo.create(data);
  },

  updateFanfarons(id, data) {
    return fanfaronRepo.update(id, data);
  },

  deleteFanfarons(id) {
    return fanfaronRepo.remove(id);
  },
};

module.exports = fanfaronService;
