// Tests dédiés au repository des contrats

jest.mock('../../services/databaseService', () => ({
  prepare: jest.fn(() => ({
    all: jest.fn(() => [
      { id: 1, titre: 'Contrat test', date: '2025-01-01' }
    ]),
    run: jest.fn(() => ({ lastInsertRowid: 1, changes: 1 }))
  }))
}));

const contratRepo = require('../../repositories/contratRepository');

describe('contratRepository', () => {
  it('find returns array of contrats', async () => {
    const rows = await contratRepo.find({});
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
  });

  it('create returns new contrat with id', async () => {
    const newContrat = await contratRepo.create({ titre: 'New', date: '2025-01-01' });
    expect(newContrat).toHaveProperty('id');
  });

  it('update returns updated contrat', async () => {
    const updated = await contratRepo.update(1, { titre: 'Updated' });
    expect(updated).toBeDefined();
  });
});
