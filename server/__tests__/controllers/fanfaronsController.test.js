// Tests dédiés au contrôleur des fanfarons
const baseFanfarons = [
  { id: 1, prenom: 'Jean', nom: 'Dupont', instrument: 'Trompette', photo: 'jean.jpg' },
  { id: 2, prenom: 'Marie', nom: 'Martin', instrument: 'Clarinette', photo: 'marie.jpg' },
];

const buildPhotoUrl = (photo) => `/public/uploads/fanfarons/${photo}`;
const attachPhoto = (f) => ({ ...f, photoUrl: buildPhotoUrl(f.photo) });

jest.mock('../../services/fanfaronService', () => ({
  getAllFanfarons: jest.fn(async () => baseFanfarons.map(attachPhoto)),
  getAllFanfaronsAnnuaire: jest.fn(async () => [attachPhoto(baseFanfarons[0])]),
  createFanfarons: jest.fn(async data => attachPhoto({
    id: 99,
    ...data,
    photo: data.photo ?? null,
  })),
  updateFanfarons: jest.fn(async (id, data) => attachPhoto({ id: Number(id), ...data })),
  deleteFanfarons: jest.fn(async () => ({ success: true })),
}));

const fanfaronCtrl = require('../../controllers/fanfaronsController');
const fanfaronService = require('../../services/fanfaronService');

function resMock() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('fanfaronsController', () => {
  it('listFanfarons renvoie une liste de fanfarons (200)', async () => {
    const res = resMock();
    await fanfaronCtrl.listFanfarons({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(Array.isArray(payload)).toBe(true);
    expect(payload.length).toBeGreaterThan(0);
  });

  it('listFanfarons gère une erreur du service (500)', async () => {
    fanfaronService.getAllFanfarons.mockRejectedValueOnce(new Error('DB error'));
    const res = resMock();
    await fanfaronCtrl.listFanfarons({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('listFanfaronsAnnuaire renvoie une liste pour l\'annuaire (200)', async () => {
    const res = resMock();
    await fanfaronCtrl.listFanfaronsAnnuaire({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(Array.isArray(payload)).toBe(true);
  });

  it('createFanfaron crée un fanfaron (201)', async () => {
    const req = { body: { nom: 'Nouveau', prenom: 'Fan', instrument: 'Tuba' }, file: { filename: 'new.jpg' } };
    const res = resMock();
    await fanfaronCtrl.createFanfaron(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 99,
      nom: 'Nouveau',
      prenom: 'Fan',
      instrument: 'Tuba',
      photo: 'new.jpg',
      photoUrl: '/public/uploads/fanfarons/new.jpg',
    });
  });

  it('updateFanfaron met à jour un fanfaron (200)', async () => {
    const req = { params: { id: '1' }, body: { instrument: 'Saxophone' }, file: { filename: 'update.jpg' } };
    const res = resMock();
    await fanfaronCtrl.updateFanfaron(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      instrument: 'Saxophone',
      photo: 'update.jpg',
      photoUrl: '/public/uploads/fanfarons/update.jpg',
    });
  });

  it('removeFanfaron supprime un fanfaron (200)', async () => {
    const req = { params: { id: '1' } };
    const res = resMock();
    await fanfaronCtrl.removeFanfaron(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Suppression réussie' });
  });
});
