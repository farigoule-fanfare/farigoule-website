// Tests dédiés au repository des fanfarons

jest.mock('../../services/databaseService', () => ({
  prepare: jest.fn(() => ({
    all: jest.fn(() => [
      { id: 1, nom: 'Dupont', prenom: 'Jean', roles: '["member"]' }
    ]),
    get: jest.fn(() => ({ id: 1, nom: 'Dupont', prenom: 'Jean', roles: '["member"]' })),
    run: jest.fn(() => ({ lastInsertRowid: 1, changes: 1 }))
  }))
}));

const fanfaronRepo = require('../../repositories/fanfaronRepository');

describe('fanfaronRepository', () => {
  it('findAll returns array of fanfarons', async () => {
    const rows = await fanfaronRepo.findAll();
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
  });

  it('findAllAnnuaire returns array', async () => {
    const rows = await fanfaronRepo.findAllAnnuaire();
    expect(Array.isArray(rows)).toBe(true);
  });

  it('create returns new fanfaron with id', async () => {
    const newFanfaron = await fanfaronRepo.create({ nom: 'Test', prenom: 'User' });
    expect(newFanfaron).toHaveProperty('id');
  });
});
