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

const app = require('express')();
app.use(require('../routes')); // mount routers

describe('integration routes', () => {
  it('GET /api/citations returns random citation', async () => {
    const res = await request(app).get('/citations');
    expect(res.status).toBe(200);
  });
});