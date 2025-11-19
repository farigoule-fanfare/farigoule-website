// Tests dédiés aux routes des contrats

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

const app = express();
app.use(require('../../routes'));

beforeEach(() => {
  jest.clearAllMocks();
});

describe('contratsRoutes', () => {
  test('GET /contrats/upcoming injects scope=upcoming', async () => {
    const res = await request(app).get('/contrats/upcoming');
    expect(res.status).toBe(200);
    expect(contratsCtrl.listContrats).toHaveBeenCalled();
    const reqArg = contratsCtrl.listContrats.mock.calls[0][0];
    expect(reqArg.query.scope).toBe('upcoming');
  });

  test('GET /contrats/past injects scope=past', async () => {
    const res = await request(app).get('/contrats/past');
    expect(res.status).toBe(200);
    expect(contratsCtrl.listContrats).toHaveBeenCalled();
    const reqArg = contratsCtrl.listContrats.mock.calls[0][0];
    expect(reqArg.query.scope).toBe('past');
  });

  test('GET /contrats without scope', async () => {
    const res = await request(app).get('/contrats');
    expect(res.status).toBe(200);
    expect(contratsCtrl.listContrats).toHaveBeenCalled();
  });
});
