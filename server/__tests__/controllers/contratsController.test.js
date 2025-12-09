// Tests dédiés au contrôleur des contrats
const mockContrats = [
  { id: 1, lieu: 'Paris', date: '2025-12-01', description: 'Concert de Noël' },
  { id: 2, lieu: 'Lyon', date: '2025-12-15', description: 'Festival d’hiver' },
];

jest.mock('../../services/contratService', () => ({
  list: jest.fn(async () => mockContrats),
  addContrat: jest.fn(async ({ date, lieu, description }) => ({ id: 99, date, lieu, description })),
  updateContrat: jest.fn(async (id, data) => ({ id, ...data })),
  deleteContrat: jest.fn(async () => ({ deleted: 1 })),
}));

const contratCtrl = require('../../controllers/contratsController');
const contratService = require('../../services/contratService');

function resMock() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('contratsController', () => {
  it('listContrats returns a contracts list (200)', async () => {
    const req = { query: {} };
    const res = resMock();
    await contratCtrl.listContrats(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(Array.isArray(payload)).toBe(true);
    expect(payload.length).toBeGreaterThan(0);
  });

  it('listContrats trims since and until filters', async () => {
    const req = { query: { since: '  2025-01-01  ', until: '  2025-12-31  ' } };
    const res = resMock();
    await contratCtrl.listContrats(req, res);
    expect(contratService.list).toHaveBeenCalledWith({
      scope: undefined,
      since: '2025-01-01',
      until: '2025-12-31',
      order: undefined,
      limit: undefined,
    });
  });

  it('listContrats parses limit as integer', async () => {
    const req = { query: { limit: '5' } };
    const res = resMock();
    await contratCtrl.listContrats(req, res);
    expect(contratService.list).toHaveBeenCalledWith({
      scope: undefined,
      since: undefined,
      until: undefined,
      order: undefined,
      limit: 5,
    });
  });

  it('listContrats handles a service error (500)', async () => {
    contratService.list.mockRejectedValueOnce(new Error('DB error'));
    const req = { query: {} };
    const res = resMock();
    await contratCtrl.listContrats(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('addContrat creates a contract (201)', async () => {
    const req = { body: { lieu: 'Marseille', date: '2026-01-10', description: 'Bal' } };
    const res = resMock();
    await contratCtrl.addContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: 99, date: '2026-01-10', lieu: 'Marseille', description: 'Bal' });
  });

  it('addContrat returns 400 when a field is missing', async () => {
    const req = { body: { lieu: 'Marseille', date: '2026-01-10', description: '' } };
    const res = resMock();
    await contratCtrl.addContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'date, lieu and description are required.' });
    expect(contratService.addContrat).not.toHaveBeenCalled();
  });

  it('addContrat handles a service error (500)', async () => {
    contratService.addContrat.mockRejectedValueOnce(new Error('create fail'));
    const req = { body: { lieu: 'Paris', date: '2026-01-10', description: 'Bal' } };
    const res = resMock();
    await contratCtrl.addContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'create fail' });
  });

  it('updateContrat updates a contract (200)', async () => {
    const req = { params: { id: '1' }, body: { lieu: 'Paris Update', description: 'Edited', date: '2025-06-06' } };
    const res = resMock();
    await contratCtrl.updateContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 1, lieu: 'Paris Update', description: 'Edited', date: '2025-06-06' });
  });

  it('updateContrat returns 400 when a field is missing', async () => {
    const req = { params: { id: '1' }, body: { lieu: 'Paris Update', date: '2025-06-06' } };
    const res = resMock();
    await contratCtrl.updateContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'date, lieu and description are required.' });
    expect(contratService.updateContrat).not.toHaveBeenCalled();
  });

  it('updateContrat handles a service error (500)', async () => {
    contratService.updateContrat.mockRejectedValueOnce(new Error('update fail'));
    const req = { params: { id: '1' }, body: { lieu: 'Paris Update', description: 'Edited', date: '2025-06-06' } };
    const res = resMock();
    await contratCtrl.updateContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'update fail' });
  });

  it('deleteContrat deletes a contract (200)', async () => {
    const req = { params: { id: '1' } };
    const res = resMock();
    await contratCtrl.deleteContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ deleted: 1 });
  });

  it('deleteContrat handles a service error (500)', async () => {
    contratService.deleteContrat.mockRejectedValueOnce(new Error('delete fail'));
    const req = { params: { id: '1' } };
    const res = resMock();
    await contratCtrl.deleteContrat(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'delete fail' });
  });
});
