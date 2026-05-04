// Tests dédiés aux routes des contrats

const express = require('express');
const request = require('supertest');

const mockProtect = jest.fn((req, _res, next) => {
  req.user = { id: 1, roles: ['admin', 'fanfaron'] };
  return next();
});

const mockAuthorize = jest.fn((roles = []) => (req, res, next) => {
  if (!roles.length) {
    return next();
  }
  const hasRole = req.user?.roles?.some((role) => roles.includes(role));
  if (!hasRole) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return next();
});

const mockContratsList = [
  { id: 1, date: '2025-06-01', lieu: 'Marseille', description: 'Fête de la musique' },
  { id: 2, date: '2025-07-14', lieu: 'Paris', description: 'Bal du 14 juillet' },
];

const mockCreatedContrat = { id: 99, date: '2025-10-10', lieu: 'Lyon', description: 'Soirée privée' };

jest.mock('../../middleware/authMiddleware', () => ({
  protect: (...args) => mockProtect(...args),
  authorize: (...args) => mockAuthorize(...args),
}));

jest.mock('../../controllers/contratsController', () => ({
  listContrats: jest.fn((_req, res) => res.status(200).json(mockContratsList)),
  addContrat: jest.fn((req, res) => res.status(201).json({ id: mockCreatedContrat.id, ...req.body })),
  updateContrat: jest.fn((req, res) => res.status(200).json({ updated: true, id: Number(req.params.id) })),
  deleteContrat: jest.fn((_req, res) => res.status(200).json({ deleted: 1 })),
}));

const contratsCtrl = require('../../controllers/contratsController');

const app = express();
app.use(express.json());
app.use(require('../../routes'));

beforeEach(() => {
  jest.clearAllMocks();
  mockProtect.mockClear();
  mockAuthorize.mockClear();
});

describe('contratsRoutes', () => {
  test('GET /contrats/upcoming injects scope=upcoming', async () => {
    const res = await request(app).get('/contrats/upcoming');
    expect(res.status).toBe(200);
    expect(contratsCtrl.listContrats).toHaveBeenCalled();
    const reqArg = contratsCtrl.listContrats.mock.calls[0][0];
    expect(reqArg.query.scope).toBe('upcoming');
    expect(mockProtect).not.toHaveBeenCalled();
    expect(res.body).toEqual(mockContratsList);
  });

  test('GET /contrats/past injects scope=past', async () => {
    const res = await request(app).get('/contrats/past');
    expect(res.status).toBe(200);
    expect(contratsCtrl.listContrats).toHaveBeenCalled();
    const reqArg = contratsCtrl.listContrats.mock.calls[0][0];
    expect(reqArg.query.scope).toBe('past');
    expect(mockProtect).not.toHaveBeenCalled();
    expect(res.body).toEqual(mockContratsList);
  });

  test('GET /contrats without scope', async () => {
    const res = await request(app).get('/contrats');
    expect(res.status).toBe(200);
    expect(contratsCtrl.listContrats).toHaveBeenCalled();
    expect(mockProtect).toHaveBeenCalled();
    expect(res.body).toEqual(mockContratsList);
  });

  test('GET /contrats refuse un non-admin', async () => {
    mockProtect.mockImplementationOnce((req, _res, next) => {
      req.user = { id: 2, roles: ['fanfaron'] };
      next();
    });
    const res = await request(app).get('/contrats');
    expect(res.status).toBe(403);
    expect(contratsCtrl.listContrats).not.toHaveBeenCalled();
  });

	test('POST /contrats crée un contrat', async () => {
		const payload = { date: '2025-12-24', lieu: 'Nice', description: 'Concert Noël' };
		const res = await request(app).post('/contrats').send(payload);
		expect(res.status).toBe(201);
		expect(contratsCtrl.addContrat).toHaveBeenCalled();
		const [[req]] = contratsCtrl.addContrat.mock.calls;
		expect(req.body).toEqual(payload);
		expect(res.body).toEqual({ id: mockCreatedContrat.id, ...payload });
		expect(mockProtect).toHaveBeenCalled();
	});

	test('PUT /contrats/:id met à jour un contrat', async () => {
		const payload = { date: '2026-01-01', lieu: 'Bordeaux', description: 'Nouvel an' };
		const res = await request(app).put('/contrats/5').send(payload);
		expect(res.status).toBe(200);
		expect(contratsCtrl.updateContrat).toHaveBeenCalled();
		const [[req]] = contratsCtrl.updateContrat.mock.calls;
		expect(req.params.id).toBe('5');
		expect(req.body).toEqual(payload);
		expect(res.body).toEqual({ updated: true, id: 5 });
	});

	test('DELETE /contrats/:id supprime un contrat', async () => {
		const res = await request(app).delete('/contrats/3');
		expect(res.status).toBe(200);
		expect(contratsCtrl.deleteContrat).toHaveBeenCalled();
		expect(res.body).toEqual({ deleted: 1 });
	});
});
