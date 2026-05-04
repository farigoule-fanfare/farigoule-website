// Tests dédiés au contrôleur des contrats
const mockContrats = [
  { id: 1, lieu: 'Paris', date: '2025-12-01', description: 'Concert de Noël' },
  { id: 2, lieu: 'Lyon', date: '2025-12-15', description: 'Festival d’hiver' },
];

jest.mock('../../services/contratService', () => ({
  list: jest.fn(async () => mockContrats),
  addContrat: jest.fn(async data => ({ id: 99, ...data })),
  updateContrat: jest.fn(async (id, data) => ({ id, ...data })),
  deleteContrat: jest.fn(async () => ({ success: true })),
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
    const req = { body: { lieu: 'Marseille', date: '2026-01-10', description: 'Bal' } };
    const res = resMock();
    await contratCtrl.addContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 99, lieu: 'Marseille', date: '2026-01-10', description: 'Bal' });
  });

  it('addContrat gère une erreur du service (500)', async () => {
    contratService.addContrat.mockRejectedValueOnce(new Error('create fail'));
    const req = { body: { lieu: 'Paris', date: '2026-01-10', description: 'Bal' } };
    const res = resMock();
    await contratCtrl.addContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'create fail' });
  });

  it('updateContrat met à jour un contrat (200)', async () => {
    const req = { params: { id: '1' }, body: { lieu: 'Paris Update', description: 'Edited' } };
    const res = resMock();
    await contratCtrl.updateContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1, lieu: 'Paris Update', description: 'Edited' });
  });

  it('updateContrat gère une erreur du service (500)', async () => {
    contratService.updateContrat.mockRejectedValueOnce(new Error('update fail'));
    const req = { params: { id: '1' }, body: { lieu: 'Paris Update' } };
    const res = resMock();
    await contratCtrl.updateContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'update fail' });
  });

  it('deleteContrat supprime un contrat (200)', async () => {
    const req = { params: { id: '1' } };
    const res = resMock();
    await contratCtrl.deleteContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('deleteContrat gère une erreur du service (500)', async () => {
    contratService.deleteContrat.mockRejectedValueOnce(new Error('delete fail'));
    const req = { params: { id: '1' } };
    const res = resMock();
    await contratCtrl.deleteContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'delete fail' });
  });
});
