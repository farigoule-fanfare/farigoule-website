// Tests dédiés au contrôleur d'authentification
jest.mock('../../services/authService', () => ({
  login: jest.fn(async () => ({ user: { id: 1, email: 'test@example.com' }, token: 'abc123' })),
  changePassword: jest.fn(async (userId, currentPw, newPw) => ({ userId, currentPw, newPw })),
  adminSetPassword: jest.fn(async (adminId, targetUserId, newPw) => ({ adminId, targetUserId, newPw }))
}));

const authCtrl = require('../../controllers/authController');
const authService = require('../../services/authService');

function resMock() {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  res.cookie = jest.fn(() => res);
  return res;
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe('authController', () => {
  it('handleLogin returns 200 and a token on success', async () => {
    const req = { body: { identifier: 'user@test.com', password: 'pass123' } };
    const res = resMock();
    await authCtrl.handleLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.cookie).toHaveBeenCalledWith('authToken', 'abc123', expect.any(Object));
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful',
      user: { id: 1, email: 'test@example.com' }
    });
  });
  
  it('handleLogin returns 400 if identifier or password is missing', async () => {
    const req = { body: {} };
    const res = resMock();
    await authCtrl.handleLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email/Surnom and password are required.' });
  });
  
  it('handleLogin returns 401 for invalid credentials', async () => {
    authService.login.mockRejectedValueOnce({ code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' });
    const req = { body: { identifier: 'wrong', password: 'wrong' } };
    const res = resMock();
    await authCtrl.handleLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });
  
  it('handleLogin returns 500 for server error', async () => {
    authService.login.mockRejectedValueOnce({ code: 'SERVER_ERROR', message: 'DB connection failed' });
    const req = { body: { identifier: 'user', password: 'pass' } };
    const res = resMock();
    await authCtrl.handleLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB connection failed' });
  });

  it('handleLogout clears cookie and returns 200', () => {
    const res = resMock();
    authCtrl.handleLogout({}, res);
    expect(res.cookie).toHaveBeenCalledWith('authToken', '', expect.objectContaining({ expires: expect.any(Date) }));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Logout successful.' });
  });
  
  it('handleCheckAuthStatus returns 200 if user is authenticated', () => {
    const req = { user: { id: 1, email: 'test@test.com' } };
    const res = resMock();
    authCtrl.handleCheckAuthStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ isAuthenticated: true, user: req.user });
  });
  
  it('handleCheckAuthStatus returns 401 if not authenticated', () => {
    const req = {};
    const res = resMock();
    authCtrl.handleCheckAuthStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ isAuthenticated: false, user: null });
  });

  it('changePassword updates password (200)', async () => {
    const req = { user: { id: 1 }, body: { currentPassword: 'old', newPassword: 'new' } };
    const res = resMock();
    await authCtrl.changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Mot de passe mis à jour.' });
    expect(authService.changePassword).toHaveBeenCalledWith(1, 'old', 'new');
  });

  it('changePassword returns 400 if fields are missing', async () => {
    const req = { user: { id: 1 }, body: { currentPassword: 'test', newPassword: '' } };
    const res = resMock();
    await authCtrl.changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'currentPassword and newPassword are required.' });
    expect(authService.changePassword).not.toHaveBeenCalled();
  });
  
  it('changePassword returns 400 if new password is the same as current', async () => {
    const req = { user: { id: 1 }, body: { currentPassword: 'samepass', newPassword: 'samepass' } };
    const res = resMock();
    await authCtrl.changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'The new password must be different from the current password.' });
    expect(authService.changePassword).not.toHaveBeenCalled();
  });
  
  it('changePassword returns 401 if not authenticated', async () => {
    const req = { user: undefined, body: { currentPassword: 'test', newPassword: 'new' } };
    const res = resMock();
    await authCtrl.changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required.' });
    expect(authService.changePassword).not.toHaveBeenCalled();
  });

  it('changePassword returns 400 on error', async () => {
    authService.changePassword.mockRejectedValueOnce(new Error('Current password incorrect'));
    const req = { user: { id: 1 }, body: { currentPassword: 'wrong', newPassword: 'new' } };
    const res = resMock();
    await authCtrl.changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Current password incorrect' });
  });

  it('adminSetPassword resets password (200)', async () => {
    const req = { user: { id: 1 }, body: { userId: 2, newPassword: 'adminReset123' } };
    const res = resMock();
    await authCtrl.adminSetPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Mot de passe réinitialisé.' });
    expect(authService.adminSetPassword).toHaveBeenCalledWith(1, 2, 'adminReset123');
  });

  it('adminSetPassword returns 400 if fields are missing', async () => {
    const req = { user: { id: 1 }, body: { userId: null, newPassword: '' } };
    const res = resMock();
    await authCtrl.adminSetPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'targetUserId and newPassword are required.' });
    expect(authService.adminSetPassword).not.toHaveBeenCalled();
  });

  it('adminSetPassword returns 401 if not authenticated', async () => {
    const req = { user: undefined, body: { userId: 2, newPassword: 'new' } };
    const res = resMock();
    await authCtrl.adminSetPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Authentication required.' });
    expect(authService.adminSetPassword).not.toHaveBeenCalled();
  });

  it('adminSetPassword returns 400 if admin targets self', async () => {
    const req = { user: { id: 1 }, body: { userId: 1, newPassword: 'new' } };
    const res = resMock();
    await authCtrl.adminSetPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Admins cannot reset their own password with adminSetPassword.' });
    expect(authService.adminSetPassword).not.toHaveBeenCalled();
  });

  it('adminSetPassword returns 400 on error', async () => {
    authService.adminSetPassword.mockRejectedValueOnce(new Error('Not authorized'));
    const req = { user: { id: 1 }, body: { userId: 2, newPassword: 'new' } };
    const res = resMock();
    await authCtrl.adminSetPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
  });
});
