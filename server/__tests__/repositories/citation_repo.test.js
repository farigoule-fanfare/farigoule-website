// Tests dédiés au repository des citations

jest.mock('../../services/databaseService', () => ({
  prepare: jest.fn(() => ({
    all: jest.fn(() => [
      { id: 1, citation: 'Test citation', auteur_id: 5 }
    ]),
    get: jest.fn(() => ({ id: 1, citation: 'Test citation', auteur_id: 5 })),
    run: jest.fn(() => ({ lastInsertRowid: 1, changes: 1 }))
  }))
}));

const citationRepo = require('../../repositories/citationRepository');

describe('citationRepository', () => {
  it('findAll returns array of citations', async () => {
    const rows = await citationRepo.findAll();
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
  });

  it('findRandom returns one citation object', async () => {
    const row = await citationRepo.findRandom();
    expect(row).toHaveProperty('citation');
  });

  it('create returns new citation', async () => {
    const newCit = await citationRepo.create({ citation: 'New', auteur_id: 2 });
    expect(newCit).toHaveProperty('id');
  });
});
