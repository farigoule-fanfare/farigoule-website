// Mock DB to track executed queries
jest.mock('../../services/databaseService', () => ({
  prepare: jest.fn(sql => {
    global.lastQuery = sql;
    return { run: jest.fn((...params) => { global.lastParams = params; }) };
  }),
}));

const userRepo = require('../../repositories/userRepository');

beforeEach(() => {
  global.lastQuery = undefined;
  global.lastParams = undefined;
});

describe('userRepository update queries', () => {
  it('updateProfile builds SET clause with provided fields', () => {
    userRepo.updateProfile(3, { nom: 'Doe', telephone: '123' });
    expect(global.lastQuery).toBe('UPDATE fanfarons SET nom = ?, tel = ? WHERE id = ?');
    expect(global.lastParams).toEqual(['Doe', '123', 3]);
  });

  it('updateProfile throws when no fields given', () => {
    expect(() => userRepo.updateProfile(1, {}))
      .toThrow('Aucun champ à mettre à jour');
    expect(global.lastQuery).toBeUndefined();
  });

  it('updateRolesById serializes roles array', () => {
    userRepo.updateRolesById(2, ['admin']);
    expect(global.lastQuery).toBe('UPDATE fanfarons SET roles = ? WHERE id = ?');
    expect(global.lastParams).toEqual(['["admin"]', 2]);
  });
});
