jest.mock('../../services/citationService', () => ({
  list: jest.fn(async () => [
    { id: 10, citation: 'Une première citation', auteur_id: 2 },
    { id: 12, citation: 'La dernière citation', auteur_id: 2 }
  ]),
  random: jest.fn(async () => ({ id: 10, citation: 'Une seule citation random', auteur_id: 2 })),
  addCitation: jest.fn(async d => ({ id: 11, ...d })),
  updateCitation: jest.fn(async () => ({ changes: 0 })),
  deleteCitation: jest.fn(async () => ({ deleted: 1 }))
}));

const citationCtrl = require('../../controllers/citationsController');
const citationService = require('../../services/citationService');

beforeEach(() => { jest.clearAllMocks(); });
afterEach(() => { jest.clearAllMocks(); });

function resMock() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('citationsController', () => {
  it('listCitations returns an non-empty list', async () => {
    const res = resMock();
    await citationCtrl.listCitations({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(Array.isArray(payload)).toBe(true);
    expect(payload.length).toBeGreaterThan(0);
    payload.forEach(c => {
      expect(Object.keys(c).sort()).toEqual(['auteur_id', 'citation', 'id']);
      expect(typeof c.citation).toBe('string');
    });
  });
  
  it('listCitations gère une erreur du service', async () => {
    citationService.list.mockRejectedValueOnce(new Error('DB down'));
    const res = resMock();
    await citationCtrl.listCitations({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unable to fetch citations' });
  });
  
  it('randomCitation returns a citation object', async () => {
    const res = resMock();
    await citationCtrl.randomCitation({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const obj = res.json.mock.calls[0][0];
    expect(Object.keys(obj).sort()).toEqual(['auteur_id', 'citation', 'id']);
    expect(typeof obj.citation).toBe('string');
  });

  it('randomCitation handles a service error', async () => {
    citationService.random.mockRejectedValueOnce(new Error('random fail'));
    const res = resMock();
    await citationCtrl.randomCitation({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Unable to fetch random citation' });
  });

  it('addCitation creates a citation', async () => {
    const res = resMock();
    const req = { body: { citation: 'Carpe diem', auteur_id: 5 } };
    await citationCtrl.addCitation(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    const created = res.json.mock.calls[0][0];
    expect(Object.keys(created).sort()).toEqual(['auteur_id', 'citation', 'id']);
    expect(created).toHaveProperty('citation', 'Carpe diem');
    expect(created).toHaveProperty('auteur_id', 5);
    expect(typeof created.citation).toBe('string');
  });

  it('addCitation handles a service error', async () => {
    citationService.addCitation.mockRejectedValueOnce(new Error('boom'));
    const res = resMock();
    const req = { body: { citation: 'Carpe diem', auteur_id: 5 } };
    await citationCtrl.addCitation(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'boom' });
  });

  it('updateCitation updated a citation', async () => {
    const res = resMock();
    const req = { params: { id: '10' }, body: { citation: 'Tempus fugit (edit)', auteur_id: 2 } };
    await citationCtrl.updateCitation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(payload).toHaveProperty('changes');
    expect(typeof payload.changes).toBe('number');
  });

  it('updateCitation handles a service error', async () => {
    citationService.updateCitation.mockRejectedValueOnce(new Error('update fail'));
    const res = resMock();
    const req = { params: { id: '10' }, body: { citation: 'Tempus fugit (edit)', auteur_id: 2 } };
    await citationCtrl.updateCitation(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'update fail' });
  });

  it('deleteCitation deletes a citation (200)', async () => {
    const res = resMock();
    const req = { params: { id: '10' } };
    await citationCtrl.deleteCitation(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(payload).toHaveProperty('deleted');
    expect(payload.deleted).toBe(1);
  });

  it('deleteCitation handles a service error', async () => {
    citationService.deleteCitation.mockRejectedValueOnce(new Error('delete fail'));
    const res = resMock();
    const req = { params: { id: '10' } };
    await citationCtrl.deleteCitation(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'delete fail' });
  });

});