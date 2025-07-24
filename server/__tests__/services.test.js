jest.mock('../repositories/authRepository', () => ({
  findFanfaronBy: jest.fn(async () => ({ id: 1, surnom: 'a', roles: ['admin'], password_hash: 'hash' })),
  updatePasswordById: jest.fn(async () => true),
  findPasswordHashById: jest.fn(async () => 'hash')
}));

jest.mock('../repositories/citationRepository', () => ({
  findAll: jest.fn(async () => []),
  findRandom: jest.fn(async () => ({})),
  create: jest.fn(async d => d),
  update: jest.fn(async () => ({ changes: 1 })),
  remove: jest.fn(async () => ({ deleted: 1 }))
}));

jest.mock('../repositories/contratRepository', () => ({
  find: jest.fn(async () => []),
  create: jest.fn(async d => d),
  update: jest.fn(async () => ({ changes: 1 })),
  remove: jest.fn(async () => ({ deleted: 1 }))
}));

jest.mock('../repositories/diapoRepository', () => ({
  find: jest.fn(async () => [{ id: 1, fichier: 'f', description: 'd' }]),
  create: jest.fn(async d => ({ id: 1, ...d })),
  update: jest.fn(async () => ({ id: 1, changes: 1 })),
  remove: jest.fn(async () => ({ deleted: 1 }))
}));

jest.mock('../repositories/fanfaronRepository', () => ({
  findAll: jest.fn(async () => [{ id: 1, photo: 'p' }]),
  findAllAnnuaire: jest.fn(async () => [{ id: 1, photo: 'p' }]),
  create: jest.fn(async d => ({ id: 1, ...d })),
  update: jest.fn(async (id, d) => ({ id, ...d })),
  remove: jest.fn(async () => ({ deleted: 1 }))
}));

jest.mock('../repositories/userRepository', () => ({
  getCurrentPresident: jest.fn(async () => ({})),
  findAllUsersRoles: jest.fn(async () => []),
  findRolesById: jest.fn(async () => ({ id: 1, roles: ['user'] })),
  updateRolesById: jest.fn(async () => {}),
  updateProfile: jest.fn(() => {}),
  findFanfaronById: jest.fn(async id => ({ id, roles: [] }))
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(async () => true),
  hash: jest.fn(async () => 'hashed')
}));

const authService = require('../services/authService');
const citationService = require('../services/citationService');
const contratService = require('../services/contratService');
const diapoService = require('../services/diapoService');
const fanfaronService = require('../services/fanfaronService');
const userService = require('../services/userService');

describe('services', () => {
  it('authService.generateToken returns token', () => {
    const token = authService.generateToken({ id: 1, surnom: 'a', roles: ['admin'] });
    expect(typeof token).toBe('string');
  });

  it('authService.login works', async () => {
    const res = await authService.login('a', 'b');
    expect(res.user.id).toBe(1);
  });

  it('citationService.list calls repo', async () => {
    const res = await citationService.list();
    expect(Array.isArray(res)).toBe(true);
  });

  it('contratService.addContrat returns data', async () => {
    const res = await contratService.addContrat({});
    expect(res).toEqual({});
  });

  it('diapoService.list maps imageUrl', async () => {
    const res = await diapoService.list({});
    expect(res[0].imageUrl).toBeDefined();
  });

  it('fanfaronService.createFanfarons sets default email', async () => {
    const res = await fanfaronService.createFanfarons({ email: '', photo: 'p' });
    expect(res.email).toContain('user');
  });

  it('userService.addAdminRole adds admin', async () => {
    const res = await userService.addAdminRole(1);
    expect(res.roles).toContain('admin');
  });
});