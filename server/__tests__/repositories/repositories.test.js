// Mock db service used by all repositories
jest.mock('../../services/databaseService', () => ({
  prepare: jest.fn(() => ({
    get: jest.fn(() => ({ id: 1, roles: '["admin"]', password_hash: 'hash' })),
    all: jest.fn(() => [{ id: 1, roles: '["admin"]' }]),
    run: jest.fn(() => ({ lastInsertRowid: 1, changes: 1 }))
  }))
}));

const authRepo = require('../../repositories/authRepository');
const citationRepo = require('../../repositories/citationRepository');
const contratRepo = require('../../repositories/contratRepository');
const diapoRepo = require('../../repositories/diapoRepository');
const fanfaronRepo = require('../../repositories/fanfaronRepository');
const userRepo = require('../../repositories/userRepository');

describe('repositories', () => {
  it('authRepository.findFanfaronBy returns parsed user', async () => {
    const user = await authRepo.findFanfaronBy({ field: 'id', value: 1 });
    expect(user.roles).toEqual(['admin']);
  });

  it('authRepository.findPasswordHashById returns hash', async () => {
    const hash = await authRepo.findPasswordHashById(1);
    expect(hash).toBe('hash');
  });

  it('authRepository.updatePasswordById returns true', async () => {
    const ok = await authRepo.updatePasswordById(1, 'new');
    expect(ok).toBe(true);
  });

  it('citationRepository.findAll returns array', async () => {
    const rows = await citationRepo.findAll();
    expect(Array.isArray(rows)).toBe(true);
  });

  it('contratRepository.find returns array', async () => {
    const rows = await contratRepo.find({});
    expect(Array.isArray(rows)).toBe(true);
  });

  it('diapoRepository.find returns array', async () => {
    const rows = await diapoRepo.find({});
    expect(Array.isArray(rows)).toBe(true);
  });

  it('fanfaronRepository.findAll returns array', async () => {
    const rows = await fanfaronRepo.findAll();
    expect(Array.isArray(rows)).toBe(true);
  });

  it('userRepository.findRolesById returns object', async () => {
    const user = await userRepo.findRolesById(1);
    expect(user.roles).toEqual(['admin']);
  });
});