// Tests dédiés au contrôleur des fanfarons
jest.mock('../../services/fanfaronService', () => ({
  getAllFanfarons: jest.fn(async () => [
    { id: 1, nom: 'Dupont', prenom: 'Jean', instrument: 'Trompette' },
    { id: 2, nom: 'Martin', prenom: 'Marie', instrument: 'Clarinette' }
  ]),
  getAllFanfaronsAnnuaire: jest.fn(async () => [
    { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@example.com' }
  ]),
  createFanfarons: jest.fn(async d => d),
  updateFanfarons: jest.fn(async () => ({ success: true })),
  deleteFanfarons: jest.fn(async () => ({ success: true }))
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
    const req = { body: { nom: 'Nouveau', prenom: 'Fan', instrument: 'Tuba' } };
    const res = resMock();
    await fanfaronCtrl.createFanfaron(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ nom: 'Nouveau', prenom: 'Fan', instrument: 'Tuba' });
  });

  it('updateFanfaron met à jour un fanfaron (200)', async () => {
    const req = { params: { id: '1' }, body: { instrument: 'Saxophone' } };
    const res = resMock();
    await fanfaronCtrl.updateFanfaron(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('deleteFanfaron supprime un fanfaron (200)', async () => {
    const req = { params: { id: '1' } };
    const res = resMock();
    await fanfaronCtrl.deleteFanfaron(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
