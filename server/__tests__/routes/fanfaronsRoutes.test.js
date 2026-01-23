// Tests dédiés aux routes des fanfarons

const express = require('express');
const request = require('supertest');

jest.mock('multer', () => {
  const actual = jest.requireActual('multer');
  const mocked = (options = {}) => {
    mocked.__lastOptions = options;
    const normalized = { ...options, storage: actual.memoryStorage() };
    return actual(normalized);
  };
  Object.keys(actual).forEach((key) => {
    mocked[key] = actual[key];
  });
  const origDiskStorage = actual.diskStorage;
  mocked.diskStorage = (config) => {
    mocked.__storageConfig = config;
    return origDiskStorage(config);
  };
  mocked.__reset = () => {
    mocked.__lastOptions = undefined;
    mocked.__storageConfig = undefined;
  };
  return mocked;
});

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

const mockFanfaronsList = [
  { id: 1, prenom: 'Lulu', nom: 'Trompette', photo: 'lulu.jpg', photoUrl: '/public/uploads/fanfarons/lulu.jpg' },
  { id: 2, prenom: 'Mimi', nom: 'Clarinette', photo: 'mimi.jpg', photoUrl: '/public/uploads/fanfarons/mimi.jpg' },
];

const mockAnnuaireList = [
  { id: 3, prenom: 'Fufu', nom: 'Sax', telephone: '0102030405', photo: 'fufu.jpg', photoUrl: '/public/uploads/fanfarons/fufu.jpg' },
];

jest.mock('../../middleware/authMiddleware', () => ({
  protect: (...args) => mockProtect(...args),
  authorize: (...args) => mockAuthorize(...args),
}));

jest.mock('../../controllers/fanfaronsController', () => ({
  listFanfarons: jest.fn((_req, res) => res.status(200).json(mockFanfaronsList)),
  listFanfaronsAnnuaire: jest.fn((_req, res) => res.status(200).json(mockAnnuaireList)),
  createFanfaron: jest.fn((req, res) => {
    const filename = req.file?.originalname || req.file?.filename || null;
    const response = {
      id: 99,
      ...req.body,
      photo: filename,
      photoUrl: filename ? `/public/uploads/fanfarons/${filename}` : null,
    };
    return res.status(201).json(response);
  }),
  updateFanfaron: jest.fn((req, res) => {
    const filename = req.file?.originalname || req.file?.filename || null;
    const response = {
      id: Number(req.params.id),
      ...req.body,
      photo: filename,
      photoUrl: filename ? `/public/uploads/fanfarons/${filename}` : null,
    };
    return res.status(200).json(response);
  }),
  removeFanfaron: jest.fn((_req, res) => res.status(200).json({ message: 'Suppression réussie' })),
}));
const fanfaronsCtrl = require('../../controllers/fanfaronsController');

const app = express();
app.use(require('../../routes'));

beforeEach(() => {
  jest.clearAllMocks();
  mockProtect.mockClear();
  mockAuthorize.mockClear();
});

describe('fanfaronsRoutes', () => {
  test('GET /fanfarons returns 200', async () => {
    const res = await request(app).get('/fanfarons');
    expect(res.status).toBe(200);
    expect(fanfaronsCtrl.listFanfarons).toHaveBeenCalled();
    expect(mockProtect).not.toHaveBeenCalled();
    expect(res.body).toEqual(mockFanfaronsList);
  });

  test('GET /fanfarons/annuaire returns 200', async () => {
    const res = await request(app).get('/fanfarons/annuaire');
    expect(res.status).toBe(200);
    expect(fanfaronsCtrl.listFanfaronsAnnuaire).toHaveBeenCalled();
    expect(mockProtect).toHaveBeenCalled();
    expect(res.body).toEqual(mockAnnuaireList);
  });

  test('POST /fanfarons uploads photo', async () => {
    const res = await request(app)
      .post('/fanfarons')
      .attach('photoFanfaron', Buffer.from('a'), 'avatar.jpg')
      .field('prenom', 'Avatar');
    expect(res.status).toBe(201);
    const reqArg = fanfaronsCtrl.createFanfaron.mock.calls[0][0];
    expect(reqArg.file).toBeDefined();
    expect(reqArg.file.fieldname).toBe('photoFanfaron');
    expect(res.body.photoUrl).toContain('avatar');
    expect(mockProtect).toHaveBeenCalled();
  });

  test('POST /fanfarons with empty file is ignored', async () => {
    const res = await request(app)
      .post('/fanfarons')
      .attach('photoFanfaron', Buffer.alloc(0), '')
      .field('prenom', 'NoFile');
    expect(res.status).toBe(201);
    const reqArg = fanfaronsCtrl.createFanfaron.mock.calls[0][0];
    expect(reqArg.file).toBeUndefined();
    expect(res.body.photo).toBeNull();
  });
  
  test('POST /fanfarons without file', async () => {
    const res = await request(app)
      .post('/fanfarons')
      .field('dummy', '1');
    expect(res.status).toBe(201);
    const reqArg = fanfaronsCtrl.createFanfaron.mock.calls[0][0];
    expect(reqArg.file).toBeUndefined();
    expect(res.body.photo).toBeNull();
  });

  test('POST /fanfarons refuse un non-admin', async () => {
    mockProtect.mockImplementationOnce((req, _res, next) => {
      req.user = { roles: ['fanfaron'] };
      next();
    });
    const res = await request(app)
      .post('/fanfarons')
      .attach('photoFanfaron', Buffer.from('x'), 'blocked.jpg');
    expect(res.status).toBe(403);
    expect(fanfaronsCtrl.createFanfaron).not.toHaveBeenCalled();
  });

  test('PATCH /fanfarons/:id met à jour un fanfaron', async () => {
    const res = await request(app)
      .patch('/fanfarons/5')
      .field('prenom', 'Updated')
      .attach('photoFanfaron', Buffer.from('b'), 'updated.jpg');
    expect(res.status).toBe(200);
    const reqArg = fanfaronsCtrl.updateFanfaron.mock.calls[0][0];
    expect(reqArg.params.id).toBe('5');
    expect(reqArg.file).toBeDefined();
    expect(res.body.id).toBe(5);
    expect(res.body.photoUrl).toContain('updated');
  });

  test('DELETE /fanfarons/:id supprime un fanfaron', async () => {
    const res = await request(app).delete('/fanfarons/7');
    expect(res.status).toBe(200);
    expect(fanfaronsCtrl.removeFanfaron).toHaveBeenCalled();
    expect(res.body).toEqual({ message: 'Suppression réussie' });
  });
});

describe('fanfaronsRoutes upload configuration', () => {
  test('storage writes into fanfarons directory with generated filename', () => {
    jest.isolateModules(() => {
      const mockedMulter = require('multer');
      mockedMulter.__reset();
      require('../../routes/fanfaronsRoutes');
      const storageCfg = mockedMulter.__storageConfig;
      expect(storageCfg).toBeDefined();

      const destinationCb = jest.fn();
      storageCfg.destination({}, { originalname: 'photo.jpg' }, destinationCb);
      expect(destinationCb).toHaveBeenCalledWith(null, 'public/uploads/fanfarons');

      const filenameCb = jest.fn();
      storageCfg.filename({}, { originalname: 'photo.jpg' }, filenameCb);
      const generated = filenameCb.mock.calls[0][1];
      expect(generated).toMatch(/\.jpg$/);
    });
  });

  test('fileFilter rejects empty filenames and accepts valid ones', () => {
    jest.isolateModules(() => {
      const mockedMulter = require('multer');
      mockedMulter.__reset();
      require('../../routes/fanfaronsRoutes');
      const fileFilter = mockedMulter.__lastOptions.fileFilter;
      expect(fileFilter).toBeInstanceOf(Function);

      const cbReject = jest.fn();
      fileFilter({}, { originalname: '' }, cbReject);
      expect(cbReject).toHaveBeenCalledWith(null, false);

      const cbAccept = jest.fn();
      fileFilter({}, { originalname: 'ok.png' }, cbAccept);
      expect(cbAccept).toHaveBeenCalledWith(null, true);
    });
  });
});
