const request = require('supertest');

jest.mock('../middleware/authMiddleware', () => ({
  protect: (_req, _res, next) => { _req.user = { roles: ['admin'] }; next(); },
  authorize: () => (_req, _res, next) => next()
}));

// Reuse same service mocks from controllers test
jest.mock('../services/citationService', () => ({
  list: jest.fn(async () => []),
  random: jest.fn(async () => ({ id: 1 })),
  addCitation: jest.fn(async d => d),
  updateCitation: jest.fn(async () => ({})),
  deleteCitation: jest.fn(async () => ({}))
}));

jest.mock('../services/contratService', () => ({
  list: jest.fn(async () => [{ id: 1, date: '2024-01-01', lieu: 'A', description: 'test' }]),
  addContrat: jest.fn(async d => d),
  updateContrat: jest.fn(async () => ({})),
  deleteContrat: jest.fn(async () => ({}))
}));

jest.mock('../services/diapoService', () => ({
  list: jest.fn(async () => [{ id: 1, imageUrl: '/public/uploads/carousel/a.jpg' }]),
  addDiapo: jest.fn(async d => d),
  updateDiapo: jest.fn(async () => ({})),
  deleteDiapo: jest.fn(async () => ({}))
}));

jest.mock('../services/fanfaronService', () => ({
  getAllFanfarons: jest.fn(async () => [{ id: 1, photoUrl: '/public/uploads/fanfarons/a.jpg' }]),
  getAllFanfaronsAnnuaire: jest.fn(async () => []),
  createFanfarons: jest.fn(async d => d),
  updateFanfarons: jest.fn(async () => ({})),
  deleteFanfarons: jest.fn(async () => ({}))
}));

const app = require('express')();
app.use(require('../routes')); // mount routers

describe('integration routes', () => {
  it('GET /api/citations returns random citation', async () => {
    const res = await request(app).get('/citations');
    expect(res.status).toBe(200);
  });

  it('GET /fanfarons returns list with photoUrl', async () => {
    const res = await request(app).get('/fanfarons');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].photoUrl).toBeDefined();
  });

  it('GET /contrats returns list of contrats', async () => {
    const res = await request(app).get('/contrats');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].id).toBe(1);
  });

  it('GET /diapos/ordered returns diapos with imageUrl', async () => {
    const res = await request(app).get('/diapos/ordered');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0].imageUrl).toBeDefined();
  });
});