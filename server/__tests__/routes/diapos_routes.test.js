// Tests dédiés aux routes des diapos

const express = require('express');
const request = require('supertest');

jest.mock('../../middleware/authMiddleware', () => ({
  protect: (_req, _res, next) => { _req.user = { roles: ['admin'] }; next(); },
  authorize: () => (_req, _res, next) => next(),
}));

jest.mock('../../controllers/diaposController', () => ({
  listDiapos: jest.fn((req, res) => res.status(200).end()),
  addDiapo: jest.fn((req, res) => res.status(201).end()),
  updateDiapo: jest.fn(),
  deleteDiapo: jest.fn(),
}));
const diaposCtrl = require('../../controllers/diaposController');

const app = express();
app.use(require('../../routes'));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('diaposRoutes', () => {
  test('GET /diapos defaults query to order=random, limit=5', async () => {
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

  test('GET /diapos/ordered injects order=desc, all=true', async () => {
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
