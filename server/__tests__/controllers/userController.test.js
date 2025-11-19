// Tests dédiés au contrôleur des utilisateurs
jest.mock('../../services/userService', () => ({
	getCurrentPresident: jest.fn(async () => ({ id: 1, nom: 'Président', prenom: 'Actuel', role: 'president' })),
	getAllUsersRoles: jest.fn(async () => [
		{ id: 1, nom: 'User1', roles: ['admin', 'fanfaron'] },
		{ id: 2, nom: 'User2', roles: ['fanfaron'] },
	]),
	updateProfile: jest.fn(async () => ({ success: true })),
	addAdminRole: jest.fn(async () => {}),
	removeAdminRole: jest.fn(async () => {}),
}));

const userCtrl = require('../../controllers/userController');
const userService = require('../../services/userService');

function resMock() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
}

describe('userController', () => {
  let res;

  beforeEach(() => {
    res = resMock();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('getCurrentPresident renvoie le président actuel (200)', async () => {
    await userCtrl.getCurrentPresident({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(payload).toHaveProperty('role', 'president');
  });

  it('getCurrentPresident gère une erreur du service (500)', async () => {
    userService.getCurrentPresident.mockRejectedValueOnce(new Error('DB error'));
    res = resMock();
    await userCtrl.getCurrentPresident({}, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });

  it('listUsersRoles renvoie la liste des rôles (200)', async () => {
    await userCtrl.listUsersRoles({}, res);
    expect(res.status).toHaveBeenCalledWith(200);
    const payload = res.json.mock.calls[0][0];
    expect(Array.isArray(payload)).toBe(true);
    expect(payload.length).toBeGreaterThan(0);
    expect(payload[0]).toHaveProperty('roles');
  });

  it('updateProfile met à jour le profil (200)', async () => {
    const req = { user: { id: 1 }, body: { nom: 'Updated' } };
    await userCtrl.updateProfile(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('addAdminRole ajoute un rôle admin (200)', async () => {
    const req = { params: { id: '2' } };
    await userCtrl.addAdminRole(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(userService.addAdminRole).toHaveBeenCalledWith(2);
  });

  it('removeAdminRole retire un rôle admin (200)', async () => {
    const req = { params: { id: '2' } };
    await userCtrl.removeAdminRole(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(userService.removeAdminRole).toHaveBeenCalledWith(2);
  });
});
