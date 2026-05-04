// Tests dédiés au contrôleur des diapos
const mockBaseDiapos = [
  { id: 1, fichier: 'img1.jpg', description: 'Description 1' },
  { id: 2, fichier: 'img2.jpg', description: 'Description 2' },
];

const buildMockImageUrl = (file) => `/public/uploads/carousel/${file}`;

jest.mock('../../services/diapoService', () => ({
  list: jest.fn(async () => mockBaseDiapos.map(diapo => ({
    ...diapo,
    imageUrl: `/public/uploads/carousel/${diapo.fichier}`,
  }))),
  addDiapo: jest.fn(async payload => ({
    id: 99,
    ...payload,
    imageUrl: buildMockImageUrl(payload.fichier),
  })),
  updateDiapo: jest.fn(async (id, payload) => ({
    id,
    ...payload,
    imageUrl: buildMockImageUrl(payload.fichier),
  })),
  deleteDiapo: jest.fn(async () => ({ success: true })),
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
    expect(res.json).toHaveBeenCalledWith({
      id: 99,
      fichier: 'new.jpg',
      description: 'Nouvelle diapo',
      imageUrl: '/public/uploads/carousel/new.jpg',
    });
  });

  it('addDiapo gère une erreur du service (500)', async () => {
    diapoService.addDiapo.mockRejectedValueOnce(new Error('Add KO'));
    const req = { file: { filename: 'boom.jpg' }, body: { description: 'Fail' } };
    const res = resMock();
    await diapoCtrl.addDiapo(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Add KO' });
  });

  it('updateDiapo met à jour une diapo (200)', async () => {
    const req = { params: { id: '1' }, file: { filename: 'updated.jpg' }, body: { description: 'Diapo modifiée' } };
    const res = resMock();
    await diapoCtrl.updateDiapo(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      fichier: 'updated.jpg',
      description: 'Diapo modifiée',
      imageUrl: '/public/uploads/carousel/updated.jpg',
    });
  });

  it('updateDiapo gère une erreur du service (500)', async () => {
    diapoService.updateDiapo.mockRejectedValueOnce(new Error('Update KO'));
    const req = { params: { id: '2' }, file: { filename: 'oops.jpg' }, body: { description: 'Fail' } };
    const res = resMock();
    await diapoCtrl.updateDiapo(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Update KO' });
  });

  it('deleteDiapo supprime une diapo (200)', async () => {
    const req = { params: { id: '1' } };
    const res = resMock();
    await diapoCtrl.deleteDiapo(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('deleteDiapo gère une erreur du service (500)', async () => {
    diapoService.deleteDiapo.mockRejectedValueOnce(new Error('Delete KO'));
    const req = { params: { id: '3' } };
    const res = resMock();
    await diapoCtrl.deleteDiapo(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Delete KO' });
  });
});
