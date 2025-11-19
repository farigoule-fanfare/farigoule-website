// Tests dédiés au repository des diapos

jest.mock('../../services/databaseService', () => ({
  prepare: jest.fn(() => ({
    all: jest.fn(() => [
      { id: 1, titre: 'Diapo test', url: 'http://example.com/diapo.jpg' }
    ]),
    run: jest.fn(() => ({ lastInsertRowid: 1, changes: 1 }))
  }))
}));

const diapoRepo = require('../../repositories/diapoRepository');

describe('diapoRepository', () => {
  it('find returns array of diapos', async () => {
    const rows = await diapoRepo.find({});
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
  });

  it('create returns new diapo with id', async () => {
    const newDiapo = await diapoRepo.create({ titre: 'New', url: 'http://example.com' });
    expect(newDiapo).toHaveProperty('id');
  });

  it('update returns updated diapo', async () => {
    const updated = await diapoRepo.update(1, { titre: 'Updated' });
    expect(updated).toBeDefined();
  });
});
