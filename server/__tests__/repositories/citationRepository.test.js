// Tests dédiés au repository des citations

const mockPrepare = jest.fn(() => ({
  all: jest.fn(() => [
    { id: 1, citation: 'Test citation', auteur_id: 5 }
  ]),
  get: jest.fn(() => ({ id: 1, citation: 'Test citation', auteur_id: 5 })),
  run: jest.fn(() => ({ lastInsertRowid: 1, changes: 1 })),
}));

jest.mock('../../services/databaseService', () => ({
  prepare: (...args) => mockPrepare(...args),
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

  it('existsExact returns true when row found', async () => {
    const exists = await citationRepo.existsExact('Test citation');
    expect(exists).toBe(true);
    expect(mockPrepare).toHaveBeenCalledWith('SELECT 1 FROM citations WHERE citation = ? LIMIT 1');
  });

  it('update returns changes count', async () => {
    const result = await citationRepo.update(1, { citation: 'Updated', auteur_id: 3 });
    expect(result).toEqual({ changes: 1 });
  });

  it('remove returns deleted count', async () => {
    const result = await citationRepo.remove(1);
    expect(result).toEqual({ deleted: 1 });
  });
});
