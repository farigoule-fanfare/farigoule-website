// Tests dédiés au contrôleur des contrats
jest.mock('../../services/contratService', () => ({
  list: jest.fn(async () => [
    { id: 1, lieu: 'Paris', date: '2025-12-01', type: 'Concert' },
    { id: 2, lieu: 'Lyon', date: '2025-12-15', type: 'Festival' }
  ]),
  addContrat: jest.fn(async d => d),
  updateContrat: jest.fn(async () => ({ success: true })),
  deleteContrat: jest.fn(async () => ({ success: true }))
}));

const contratCtrl = require('../../controllers/contratsController');
const contratService = require('../../services/contratService');

function resMock() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('contratsController', () => {
  it('listContrats renvoie une liste de contrats (200)', async () => {
    const req = { query: {} };
    const res = resMock();
    await contratCtrl.listContrats(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(Array.isArray(payload)).toBe(true);
    expect(payload.length).toBeGreaterThan(0);
  });

  it('listContrats gère une erreur du service (500)', async () => {
    contratService.list.mockRejectedValueOnce(new Error('DB error'));
    const req = { query: {} };
    const res = resMock();
    await contratCtrl.listContrats(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('addContrat crée un contrat (201)', async () => {
    const req = { body: { lieu: 'Marseille', date: '2026-01-10', type: 'Bal' } };
    const res = resMock();
    await contratCtrl.addContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ lieu: 'Marseille', date: '2026-01-10', type: 'Bal' });
  });

  it('updateContrat met à jour un contrat (200)', async () => {
    const req = { params: { id: '1' }, body: { lieu: 'Paris Update' } };
    const res = resMock();
    await contratCtrl.updateContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('deleteContrat supprime un contrat (200)', async () => {
    const req = { params: { id: '1' } };
    const res = resMock();
    await contratCtrl.deleteContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
