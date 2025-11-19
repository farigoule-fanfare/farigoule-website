// Tests dédiés au repository des users

jest.mock('../../services/databaseService', () => ({
  prepare: jest.fn(() => ({
    get: jest.fn(() => ({ id: 1, roles: '["admin","president"]', nom: 'Dupont' })),
    all: jest.fn(() => [
      { id: 1, roles: '["admin"]' },
      { id: 2, roles: '["member"]' }
    ]),
    run: jest.fn(() => ({ changes: 1 }))
  }))
}));

const userRepo = require('../../repositories/userRepository');

describe('userRepository', () => {
  it('findRolesById returns user with parsed roles array', async () => {
    const user = await userRepo.findRolesById(1);
    expect(user.roles).toEqual(['admin', 'president']);
  });

  it('findCurrentPresident returns president object', async () => {
    const president = await userRepo.findCurrentPresident();
    expect(president).toBeDefined();
  });

  it('findAllWithRoles returns array of users', async () => {
    const rows = await userRepo.findAllWithRoles();
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
  });
});
