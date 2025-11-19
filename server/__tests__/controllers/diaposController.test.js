// Tests dédiés au contrôleur des diapos
jest.mock('../../services/diapoService', () => ({
  list: jest.fn(async () => [
    { id: 1, title: 'Diapo 1', description: 'Description 1', fichier: 'img1.jpg' },
    { id: 2, title: 'Diapo 2', description: 'Description 2', fichier: 'img2.jpg' }
  ]),
  addDiapo: jest.fn(async payload => ({ id: 99, ...payload })),
  updateDiapo: jest.fn(async () => ({ success: true })),
  deleteDiapo: jest.fn(async () => ({ success: true }))
}));

const diapoCtrl = require('../../controllers/diaposController');
const diapoService = require('../../services/diapoService');

function resMock() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('diaposController', () => {
  it('listDiapos renvoie une liste de diapos (200)', async () => {
    const req = { query: {} };
    const res = resMock();
    await diapoCtrl.listDiapos(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(Array.isArray(payload)).toBe(true);
    expect(payload.length).toBeGreaterThan(0);
  });

  it('listDiapos gère une erreur du service (500)', async () => {
    diapoService.list.mockRejectedValueOnce(new Error('DB error'));
    const req = { query: {} };
    const res = resMock();
    await diapoCtrl.listDiapos(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('addDiapo crée une diapo (201)', async () => {
    const req = { file: { filename: 'new.jpg' }, body: { description: 'Nouvelle diapo' } };
    const res = resMock();
    await diapoCtrl.addDiapo(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 99, fichier: 'new.jpg', description: 'Nouvelle diapo' });
  });

  it('updateDiapo met à jour une diapo (200)', async () => {
    const req = { params: { id: '1' }, body: { title: 'Diapo modifiée' } };
    const res = resMock();
    await diapoCtrl.updateDiapo(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('deleteDiapo supprime une diapo (200)', async () => {
    const req = { params: { id: '1' } };
    const res = resMock();
    await diapoCtrl.deleteDiapo(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
