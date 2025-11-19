// Tests dédiés aux routes des fanfarons

const express = require('express');
const request = require('supertest');

jest.mock('../../middleware/authMiddleware', () => ({
  protect: (_req, _res, next) => { _req.user = { roles: ['admin'] }; next(); },
  authorize: () => (_req, _res, next) => next(),
}));

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

describe('fanfaronsRoutes', () => {
  test('GET /fanfarons returns 200', async () => {
    const res = await request(app).get('/fanfarons');
    expect(res.status).toBe(200);
    expect(fanfaronsCtrl.listFanfarons).toHaveBeenCalled();
  });

  test('GET /fanfarons/annuaire returns 200', async () => {
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
