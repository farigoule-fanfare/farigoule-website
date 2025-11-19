// Tests dédiés au repository d'authentification

jest.mock('../../services/databaseService', () => ({
  prepare: jest.fn(() => ({
    get: jest.fn(() => ({ id: 1, roles: '["fanfaron"]', password_hash: 'hash123' })),
    run: jest.fn(() => ({ changes: 1 }))
  }))
}));

const authRepo = require('../../repositories/authRepository');

describe('authRepository', () => {
  it('findFanfaronBy returns parsed user with roles array', async () => {
    const user = await authRepo.findFanfaronBy({ field: 'id', value: 1 });
    expect(user).toHaveProperty('id', 1);
    expect(user.roles).toEqual(['admin']);
  });

  it('findPasswordHashById returns hash', async () => {
    const hash = await authRepo.findPasswordHashById(1);
    expect(hash).toBe('hash123');
  });

  it('updatePasswordById returns true on success', async () => {
    const ok = await authRepo.updatePasswordById(1, 'newHash');
    expect(ok).toBe(true);
  });
});
