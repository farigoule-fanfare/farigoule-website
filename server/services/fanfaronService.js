const fanfaronRepo = require('../repositories/fanfaronRepository');
const buildPhotoUrl = (photo) => `/public/uploads/fanfarons/${photo}`;

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
    let newData = { ...data };
    newData.roles = JSON.stringify(["fanfaron"]);

    if (!newData.email || newData.email.trim() === '') {
      newData.email = null;
    }
    const created = await fanfaronRepo.create(newData);

    if (!created.email) {
      const defaultEmail = `user${created.id}@local`;
      await fanfaronRepo.update(created.id, { ...created, email: defaultEmail });
      created.email = defaultEmail;
    }
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
