// Tests dédiés aux routes des diapos

const express = require('express');
const request = require('supertest');

jest.mock('multer');

const mockProtect = jest.fn((req, _res, next) => {
  req.user = { id: 1, roles: ['admin', 'fanfaron'] };
  next();
});

const mockAuthorize = jest.fn((roles = []) => (req, res, next) => {
  if (!roles.length) {
    return next();
  }
  const allowed = req.user?.roles?.some((role) => roles.includes(role));
  if (!allowed) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  return next();
});

const mockDiapoList = [
  { id: 1, fichier: 'first.jpg', description: 'Première', imageUrl: '/public/uploads/carousel/first.jpg' },
  { id: 2, fichier: 'second.jpg', description: 'Deuxième', imageUrl: '/public/uploads/carousel/second.jpg' },
];

const mockCreatedDiapo = { id: 99, fichier: 'new.jpg', description: 'Nouvelle diapo', imageUrl: '/public/uploads/carousel/new.jpg' };
const mockUpdatedDiapo = { id: 42, fichier: 'update.jpg', description: 'Mise à jour', imageUrl: '/public/uploads/carousel/update.jpg' };
const mockDeletedResponse = { deleted: 1 };

jest.mock('../../middleware/authMiddleware', () => ({
  protect: (...args) => mockProtect(...args),
  authorize: (...args) => mockAuthorize(...args),
}));

jest.mock('../../controllers/diaposController', () => ({
  listDiapos: jest.fn((_req, res) => res.status(200).json(mockDiapoList)),
  addDiapo: jest.fn((_req, res) => res.status(201).json(mockCreatedDiapo)),
  updateDiapo: jest.fn((_req, res) => res.status(200).json(mockUpdatedDiapo)),
  deleteDiapo: jest.fn((_req, res) => res.status(200).json(mockDeletedResponse)),
}));
const diaposCtrl = require('../../controllers/diaposController');

const app = express();
app.use(require('../../routes'));

beforeEach(() => {
  jest.clearAllMocks();
  mockProtect.mockClear();
  mockAuthorize.mockClear();
});

describe('diaposRoutes', () => {
  test('GET /diapos defaults query to order=random, limit=5', async () => {
    const res = await request(app).get('/diapos');
    expect(res.status).toBe(200);
    const reqArg = diaposCtrl.listDiapos.mock.calls[0][0];
    expect(reqArg.query.order).toBe('random');
    expect(reqArg.query.limit).toBe('5');
    expect(res.body).toEqual(mockDiapoList);
  });

  test('GET /diapos uses provided query values', async () => {
    const res = await request(app).get('/diapos?order=asc&limit=2');
    expect(res.status).toBe(200);
    const reqArg = diaposCtrl.listDiapos.mock.calls[0][0];
    expect(reqArg.query.order).toBe('asc');
    expect(reqArg.query.limit).toBe('2');
    expect(res.body).toEqual(mockDiapoList);
  });

  test('GET /diapos/ordered injects order=desc, all=true', async () => {
    const res = await request(app).get('/diapos/ordered');
    expect(res.status).toBe(200);
    const reqArg = diaposCtrl.listDiapos.mock.calls[0][0];
    expect(reqArg.query.order).toBe('desc');
    expect(reqArg.query.all).toBe('true');
    expect(mockProtect).toHaveBeenCalled();
    expect(res.body).toEqual(mockDiapoList);
  });

  test('POST /diapos uploads a file', async () => {
    const res = await request(app)
      .post('/diapos')
      .attach('file', Buffer.from('a'), 'test.jpg');
    expect(res.status).toBe(201);
    const reqArg = diaposCtrl.addDiapo.mock.calls[0][0];
    expect(reqArg.file).toBeDefined();
    expect(reqArg.file.fieldname).toBe('file');
    expect(res.body).toEqual(mockCreatedDiapo);
    expect(mockProtect).toHaveBeenCalled();
  });

  test('POST /diapos with empty file is ignored', async () => {
    const res = await request(app)
      .post('/diapos')
      .attach('file', Buffer.alloc(0), '');
    expect(res.status).toBe(201);
    const reqArg = diaposCtrl.addDiapo.mock.calls[0][0];
    expect(reqArg.file).toBeUndefined();
    expect(res.body).toEqual(mockCreatedDiapo);
  });

  test('POST /diapos refuse un non-admin', async () => {
    mockProtect.mockImplementationOnce((req, _res, next) => {
      req.user = { id: 7, roles: ['fanfaron'] };
      next();
    });
    const res = await request(app)
      .post('/diapos')
      .attach('file', Buffer.from('x'), 'nope.jpg');
    expect(res.status).toBe(403);
    expect(diaposCtrl.addDiapo).not.toHaveBeenCalled();
  });

  test('PUT /diapos/:id met à jour la diapo', async () => {
    const payload = { description: 'Nouvelle desc' };
    const res = await request(app)
      .put('/diapos/42')
      .attach('file', Buffer.from('b'), 'update.jpg')
      .field('description', payload.description);
    expect(res.status).toBe(200);
    const reqArg = diaposCtrl.updateDiapo.mock.calls[0][0];
    expect(reqArg.params.id).toBe('42');
    expect(reqArg.file).toBeDefined();
    expect(res.body).toEqual(mockUpdatedDiapo);
  });

  test('DELETE /diapos/:id supprime la diapo', async () => {
    const res = await request(app).delete('/diapos/10');
    expect(res.status).toBe(200);
    expect(diaposCtrl.deleteDiapo).toHaveBeenCalled();
    expect(res.body).toEqual(mockDeletedResponse);
  });
});
