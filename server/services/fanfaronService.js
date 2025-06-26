// services/fanfaronService.js
const fanfaronRepo = require('../repositories/fanfaronRepository');

const BASE_URL = process.env.REACT_APP_RESTAPI_SERVER_URI;
const buildPhotoUrl = (photo) =>
  `${BASE_URL}/public/uploads/fanfarons/${photo}`;

const addPhotoUrl = (f) => ({
  ...f,
  photoUrl: buildPhotoUrl(f.photo),
});

const fanfaronService = {
  async getAllFanfarons() {
    const fanfarons = await fanfaronRepo.findAll();
    return fanfarons.map(addPhotoUrl);
  },

  async getAllFanfaronsAnnuaire() {
    const fanfarons = await fanfaronRepo.findAllAnnuaire();
    return fanfarons.map(addPhotoUrl);
  },

  async createFanfarons(data) {
    const created = await fanfaronRepo.create(data);
    return addPhotoUrl(created);
  },

  async updateFanfarons(id, data) {
    const updated = await fanfaronRepo.update(id, data);
    return addPhotoUrl(updated);
  },

  deleteFanfarons(id) {
    return fanfaronRepo.remove(id);
  },
};

module.exports = fanfaronService;
