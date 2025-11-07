// Tests dédiés au contrôleur d'authentification
jest.mock('../../services/authService', () => ({
  login: jest.fn(async () => ({ user: { id: 1, email: 'test@example.com' }, token: 'abc123' })),
  changePassword: jest.fn(async () => {}),
  adminSetPassword: jest.fn(async () => {})
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

describe('authController', () => {
  it('handleLogin renvoie 200 et un token en cas de succès', async () => {
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

  it('handleLogin renvoie 400 si identifier ou password manquant', async () => {
    const req = { body: {} };
    const res = resMock();
    await authCtrl.handleLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email/Surnom and password are required.' });
  });

  it('handleLogin renvoie 401 pour des credentials invalides', async () => {
    authService.login.mockRejectedValueOnce({ code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' });
    const req = { body: { identifier: 'wrong', password: 'wrong' } };
    const res = resMock();
    await authCtrl.handleLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  it('handleLogin renvoie 500 pour une erreur serveur', async () => {
    authService.login.mockRejectedValueOnce({ code: 'SERVER_ERROR', message: 'DB connection failed' });
    const req = { body: { identifier: 'user', password: 'pass' } };
    const res = resMock();
    await authCtrl.handleLogin(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'DB connection failed' });
  });

  it('handleLogout efface le cookie et renvoie 200', () => {
    const res = resMock();
    authCtrl.handleLogout({}, res);
    expect(res.cookie).toHaveBeenCalledWith('authToken', '', expect.objectContaining({ expires: expect.any(Date) }));
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Logout successful.' });
  });

  it('handleCheckAuthStatus renvoie 200 si utilisateur authentifié', () => {
    const req = { user: { id: 1, email: 'test@test.com' } };
    const res = resMock();
    authCtrl.handleCheckAuthStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ isAuthenticated: true, user: req.user });
  });

  it('handleCheckAuthStatus renvoie 401 si non authentifié', () => {
    const req = {};
    const res = resMock();
    authCtrl.handleCheckAuthStatus(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ isAuthenticated: false, user: null });
  });

  it('changePassword met à jour le mot de passe (200)', async () => {
    const req = { user: { id: 1 }, body: { currentPassword: 'old', newPassword: 'new' } };
    const res = resMock();
    await authCtrl.changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Mot de passe mis à jour.' });
  });

  it('changePassword renvoie 400 en cas d\'erreur', async () => {
    authService.changePassword.mockRejectedValueOnce(new Error('Current password incorrect'));
    const req = { user: { id: 1 }, body: { currentPassword: 'wrong', newPassword: 'new' } };
    const res = resMock();
    await authCtrl.changePassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Current password incorrect' });
  });

  it('adminSetPassword réinitialise le mot de passe (200)', async () => {
    const req = { user: { id: 1 }, body: { userId: 2, newPassword: 'adminReset123' } };
    const res = resMock();
    await authCtrl.adminSetPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Mot de passe réinitialisé.' });
  });

  it('adminSetPassword renvoie 400 en cas d\'erreur', async () => {
    authService.adminSetPassword.mockRejectedValueOnce(new Error('Not authorized'));
    const req = { user: { id: 1 }, body: { userId: 2, newPassword: 'new' } };
    const res = resMock();
    await authCtrl.adminSetPassword(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized' });
  });
});
