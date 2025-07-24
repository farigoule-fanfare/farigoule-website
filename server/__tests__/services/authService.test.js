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

  it('adminSetPassword hashes password and updates', async () => {
    bcrypt.hash.mockResolvedValueOnce('new-hash');
    await authService.adminSetPassword(1, 2, 'pw');
    expect(authRepo.updatePasswordById).toHaveBeenCalledWith(2, 'new-hash');
  });

  it('adminSetPassword rejects when ids match', async () => {
    await expect(authService.adminSetPassword(1, 1, 'pw'))
      .rejects.toThrow('Use changePassword to modify your own password');
  });

  it('changePassword updates when old password correct', async () => {
    bcrypt.compare.mockResolvedValueOnce(true);
    bcrypt.hash.mockResolvedValueOnce('new-hash');
    await authService.changePassword(3, 'old', 'new');
    expect(authRepo.updatePasswordById).toHaveBeenCalledWith(3, 'new-hash');
  });

  it('changePassword rejects when old password wrong', async () => {
    bcrypt.compare.mockResolvedValueOnce(false);
    await expect(authService.changePassword(3, 'wrong', 'new'))
      .rejects.toThrow('Current password incorrect');
  });
});
