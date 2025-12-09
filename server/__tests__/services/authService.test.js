jest.mock('../../repositories/authRepository', () => ({
  findFanfaronBy: jest.fn(),
  updatePasswordById: jest.fn(async () => true),
  findPasswordHashById: jest.fn(async () => 'old-hash'),
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(async () => true),
  hash: jest.fn(async () => 'hashed'),
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(() => 'token'),
  verify: jest.fn(),
}));

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const authRepo = require('../../repositories/authRepository');

const authService = require('../../services/authService');

describe('authService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('verifyToken returns decoded payload', async () => {
    jwt.verify.mockImplementation((t, _s, cb) => cb(null, { id: 1 }));
    await expect(authService.verifyToken('t')).resolves.toEqual({ id: 1 });
  });

  it('verifyToken throws on expired token', async () => {
    jwt.verify.mockImplementation((t, _s, cb) => {
      const err = new Error('Expired');
      err.name = 'TokenExpiredError';
      cb(err);
    });
    await expect(authService.verifyToken('t')).rejects.toThrow('Token expired');
  });

  it('verifyToken rejects for invalid token', async () => {
    jwt.verify.mockImplementation((t, _s, cb) => cb(new Error('Nope')));
    await expect(authService.verifyToken('t')).rejects.toThrow('Invalid token');
  });

  it('generateToken returns a signed token', () => {
    const token = authService.generateToken({ id: 1, surnom: 'Bob', roles: ['user'] });
    expect(jwt.sign).toHaveBeenCalledWith({ id: 1, surnom: 'Bob', roles: ['user'] }, expect.any(String), expect.any(Object));
    expect(token).toBe('token');
  });

  it('generateToken throws if missing data', () => {
    expect(() => authService.generateToken({ id: 1 })).toThrow('Invalid fanfaron supplied to generateToken');
  });

  it('adminSetPassword hashes password and updates', async () => {
    bcrypt.hash.mockResolvedValueOnce('new-hash');
    await authService.adminSetPassword(1, 2, 'pw');
    expect(authRepo.updatePasswordById).toHaveBeenCalledWith(2, 'new-hash');
  });

  it('adminSetPassword rejects when ids match', async () => {
    await expect(authService.adminSetPassword(1, 1, 'pw'))
      .rejects.toThrow('Use changePassword to modify your own password');
  });

  it('changePassword updates when old password is correct', async () => {
    bcrypt.compare.mockResolvedValueOnce(true);
    bcrypt.hash.mockResolvedValueOnce('new-hash');
    await authService.changePassword(3, 'old', 'new');
    expect(authRepo.updatePasswordById).toHaveBeenCalledWith(3, 'new-hash');
  });

  it('changePassword rejects when old password is wrong', async () => {
    bcrypt.compare.mockResolvedValueOnce(false);
    await expect(authService.changePassword(3, 'wrong', 'new'))
      .rejects.toThrow('Current password incorrect');
  });

  it('changePassword rejects if user not found', async () => {
    authRepo.findPasswordHashById.mockResolvedValueOnce(null);
    await expect(authService.changePassword(3, 'old', 'new'))
      .rejects.toThrow('User not found');
  });

  it('login authenticates by email and returns user without hash', async () => {
    authRepo.findFanfaronBy.mockResolvedValueOnce({ id: 5, surnom: 'Bob', email: 'bob@test.fr', roles: ['user'], password_hash: 'hash' });
    bcrypt.compare.mockResolvedValueOnce(true);
    const result = await authService.login('bob@test.fr', 'pw');
    expect(authRepo.findFanfaronBy).toHaveBeenCalledWith({ field: 'email', value: 'bob@test.fr' });
    expect(result.user).toEqual({ id: 5, surnom: 'Bob', email: 'bob@test.fr', roles: ['user'] });
    expect(result.token).toBe('token');
  });

  it('login falls back to nickname if no email', async () => {
    authRepo.findFanfaronBy.mockResolvedValueOnce({ id: 6, surnom: 'Lulu', roles: ['user'], password_hash: 'hash' });
    bcrypt.compare.mockResolvedValueOnce(true);
    await authService.login('Lulu', 'pw');
    expect(authRepo.findFanfaronBy).toHaveBeenCalledWith({ field: 'surnom', value: 'Lulu' });
  });

  it('login rejects for invalid credentials', async () => {
    authRepo.findFanfaronBy.mockResolvedValueOnce({ id: 5, surnom: 'Bob', roles: ['user'], password_hash: 'hash' });
    bcrypt.compare.mockResolvedValueOnce(false);
    await expect(authService.login('bob@test.fr', 'pw')).rejects.toMatchObject({ code: 'INVALID_CREDENTIALS' });
  });

  it('getUserById returns null if id missing or not found', async () => {
    expect(await authService.getUserById()).toBeNull();
    authRepo.findFanfaronBy.mockResolvedValueOnce(null);
    expect(await authService.getUserById(9)).toBeNull();
  });

  it('getUserById filters out password_hash', async () => {
    authRepo.findFanfaronBy.mockResolvedValueOnce({ id: 8, surnom: 'Neo', password_hash: 'hash', roles: [] });
    const user = await authService.getUserById(8);
    expect(authRepo.findFanfaronBy).toHaveBeenCalledWith({ field: 'id', value: 8 });
    expect(user).toEqual({ id: 8, surnom: 'Neo', roles: [] });
  });
});
