// Mock services for each controller
jest.mock('../../services/authService', () => ({
  login: jest.fn(async () => ({ user: { id: 1 }, token: 't' })),
  changePassword: jest.fn(async () => {}),
  adminSetPassword: jest.fn(async () => {}),
}));

jest.mock('../../services/citationService', () => ({
  list: jest.fn(async () => []),
  random: jest.fn(async () => ({})),
  addCitation: jest.fn(async d => d),
  updateCitation: jest.fn(async () => ({})),
  deleteCitation: jest.fn(async () => ({}))
}));

jest.mock('../../services/contratService', () => ({
  list: jest.fn(async () => []),
  addContrat: jest.fn(async d => d),
  updateContrat: jest.fn(async () => ({})),
  deleteContrat: jest.fn(async () => ({}))
}));

jest.mock('../../services/diapoService', () => ({
  list: jest.fn(async () => []),
  addDiapo: jest.fn(async d => d),
  updateDiapo: jest.fn(async () => ({})),
  deleteDiapo: jest.fn(async () => ({}))
}));

jest.mock('../../services/fanfaronService', () => ({
  getAllFanfarons: jest.fn(async () => []),
  getAllFanfaronsAnnuaire: jest.fn(async () => []),
  createFanfarons: jest.fn(async d => d),
  updateFanfarons: jest.fn(async () => ({})),
  deleteFanfarons: jest.fn(async () => ({}))
}));

jest.mock('../../services/userService', () => ({
  getCurrentPresident: jest.fn(async () => ({})),
  getAllUsersRoles: jest.fn(async () => []),
  updateProfile: jest.fn(async () => ({})),
  addAdminRole: jest.fn(async () => {}),
  removeAdminRole: jest.fn(async () => {})
}));

const authCtrl = require('../../controllers/authController');
const citationCtrl = require('../../controllers/citationsController');
const contratCtrl = require('../../controllers/contratsController');
const diapoCtrl = require('../../controllers/diaposController');
const fanfaronCtrl = require('../../controllers/fanfaronsController');
const userCtrl = require('../../controllers/userController');
const sitemapCtrl = require('../../controllers/sitemapController');

function resMock() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.cookie = jest.fn(() => res);
  res.send = jest.fn(() => res);
  res.type = jest.fn(() => res);
  return res;
}

describe('controllers', () => {
  it('authController.handleLogin success', async () => {
    const req = { body: { identifier: 'i', password: 'p' } };
    const res = resMock();
    await authCtrl.handleLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('citationsController.listCitations returns 200', async () => {
    const res = resMock();
    await citationCtrl.listCitations({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('contratsController.listContrats returns 200', async () => {
    const req = { query: {} };
    const res = resMock();
    await contratCtrl.listContrats(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('diaposController.listDiapos returns 200', async () => {
    const req = { query: {} };
    const res = resMock();
    await diapoCtrl.listDiapos(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('fanfaronsController.listFanfarons returns 200', async () => {
    const res = resMock();
    await fanfaronCtrl.listFanfarons({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('userController.getCurrentPresident returns 200', async () => {
    const res = resMock();
    await userCtrl.getCurrentPresident({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('sitemapController.getSitemap returns xml', () => {
    const res = resMock();
    sitemapCtrl.getSitemap({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();
  });
});