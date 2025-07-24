const express = require('express');
const request = require('supertest');

jest.mock('../../middleware/authMiddleware', () => ({
  protect: (_req, _res, next) => { _req.user = { roles: ['admin'] }; next(); },
  authorize: () => (_req, _res, next) => next(),
}));

jest.mock('../../controllers/contratsController', () => ({
  listContrats: jest.fn((req, res) => res.status(200).end()),
  addContrat: jest.fn(),
  updateContrat: jest.fn(),
  deleteContrat: jest.fn(),
}));
const contratsCtrl = require('../../controllers/contratsController');

jest.mock('../../controllers/diaposController', () => ({
  listDiapos: jest.fn((req, res) => res.status(200).end()),
  addDiapo: jest.fn((req, res) => res.status(201).end()),
  updateDiapo: jest.fn(),
  deleteDiapo: jest.fn(),
}));
const diaposCtrl = require('../../controllers/diaposController');

jest.mock('../../controllers/fanfaronsController', () => ({
  listFanfarons: jest.fn((req, res) => res.status(200).end()),
  listFanfaronsAnnuaire: jest.fn((req, res) => res.status(200).end()),
  createFanfaron: jest.fn((req, res) => res.status(201).end()),
  updateFanfaron: jest.fn(),
  removeFanfaron: jest.fn(),
}));
const fanfaronsCtrl = require('../../controllers/fanfaronsController');

const app = express();
app.use(require('../../routes'));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('routes', () => {
  describe('contratsRoutes', () => {
    test('GET /contrats/upcoming injects scope', async () => {
      const res = await request(app).get('/contrats/upcoming');
      expect(res.status).toBe(200);
      expect(contratsCtrl.listContrats).toHaveBeenCalled();
      const reqArg = contratsCtrl.listContrats.mock.calls[0][0];
      expect(reqArg.query.scope).toBe('upcoming');
    });

    test('GET /contrats/past injects scope', async () => {
      const res = await request(app).get('/contrats/past');
      expect(res.status).toBe(200);
      expect(contratsCtrl.listContrats).toHaveBeenCalled();
      const reqArg = contratsCtrl.listContrats.mock.calls[0][0];
      expect(reqArg.query.scope).toBe('past');
    });
  });

  describe('diaposRoutes', () => {
    test('GET /diapos defaults query values', async () => {
      const res = await request(app).get('/diapos');
      expect(res.status).toBe(200);
      const reqArg = diaposCtrl.listDiapos.mock.calls[0][0];
      expect(reqArg.query.order).toBe('random');
      expect(reqArg.query.limit).toBe('5');
    });

    test('GET /diapos uses provided query values', async () => {
      const res = await request(app).get('/diapos?order=asc&limit=2');
      expect(res.status).toBe(200);
      const reqArg = diaposCtrl.listDiapos.mock.calls[0][0];
      expect(reqArg.query.order).toBe('asc');
      expect(reqArg.query.limit).toBe('2');
    });

    test('GET /diapos/ordered injects params', async () => {
      const res = await request(app).get('/diapos/ordered');
      expect(res.status).toBe(200);
      const reqArg = diaposCtrl.listDiapos.mock.calls[0][0];
      expect(reqArg.query.order).toBe('desc');
      expect(reqArg.query.all).toBe('true');
    });

    test('POST /diapos uploads a file', async () => {
      const res = await request(app)
        .post('/diapos')
        .attach('file', Buffer.from('a'), 'test.jpg');
      expect(res.status).toBe(201);
      const reqArg = diaposCtrl.addDiapo.mock.calls[0][0];
      expect(reqArg.file).toBeDefined();
      expect(reqArg.file.fieldname).toBe('file');
    });

    test('POST /diapos with empty file is ignored', async () => {
      const res = await request(app)
        .post('/diapos')
        .attach('file', Buffer.alloc(0), '');
      expect(res.status).toBe(201);
      const reqArg = diaposCtrl.addDiapo.mock.calls[0][0];
      expect(reqArg.file).toBeUndefined();
    });
  });

  describe('fanfaronsRoutes', () => {
    test('GET /fanfarons', async () => {
      const res = await request(app).get('/fanfarons');
      expect(res.status).toBe(200);
      expect(fanfaronsCtrl.listFanfarons).toHaveBeenCalled();
    });

    test('GET /fanfarons/annuaire', async () => {
      const res = await request(app).get('/fanfarons/annuaire');
      expect(res.status).toBe(200);
      expect(fanfaronsCtrl.listFanfaronsAnnuaire).toHaveBeenCalled();
    });

    test('POST /fanfarons uploads photo', async () => {
      const res = await request(app)
        .post('/fanfarons')
        .attach('photoFanfaron', Buffer.from('a'), 'avatar.jpg');
      expect(res.status).toBe(201);
      const reqArg = fanfaronsCtrl.createFanfaron.mock.calls[0][0];
      expect(reqArg.file).toBeDefined();
      expect(reqArg.file.fieldname).toBe('photoFanfaron');
    });

    test('POST /fanfarons with empty file is ignored', async () => {
      const res = await request(app)
        .post('/fanfarons')
        .attach('photoFanfaron', Buffer.alloc(0), '');
      expect(res.status).toBe(201);
      const reqArg = fanfaronsCtrl.createFanfaron.mock.calls[0][0];
      expect(reqArg.file).toBeUndefined();
    });
    
    test('POST /fanfarons without file', async () => {
      const res = await request(app)
        .post('/fanfarons')
        .field('dummy', '1');
      expect(res.status).toBe(201);
      const reqArg = fanfaronsCtrl.createFanfaron.mock.calls[0][0];
      expect(reqArg.file).toBeUndefined();
    });
  });
});
