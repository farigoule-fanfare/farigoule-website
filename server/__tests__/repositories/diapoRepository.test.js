// Tests fusionnés pour diapoRepository (find/create/update/remove + cas d'erreur)
// Fusion de l'ancien fichier diapo_repo.test.js et diapoRepositoryMutations.test.js

const mockRun = jest.fn();
const mockAll = jest.fn(() => [
  { id: 1, titre: 'Diapo test', url: 'http://example.com/diapo.jpg' }
]);

jest.mock('../../services/databaseService', () => ({
  prepare: jest.fn(() => ({
    all: mockAll,
    run: mockRun,
  })),
}));

const db = require('../../services/databaseService');
const { prepare } = db;
const diapoRepo = require('../../repositories/diapoRepository');

beforeEach(() => {
  mockRun.mockReset();
  mockAll.mockReset().mockReturnValue([ { id: 1, titre: 'Diapo test', url: 'http://example.com/diapo.jpg' } ]);
  prepare.mockClear();
});

describe('diapoRepository basic operations', () => {
  it('find returns non-empty array', async () => {
    const rows = await diapoRepo.find({});
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
    expect(mockAll).toHaveBeenCalled();
  });

  it('create returns new diapo with id & changes', async () => {
    mockRun.mockReturnValueOnce({ lastInsertRowid: 5, changes: 1 });
    const newDiapo = await diapoRepo.create({ titre: 'New', url: 'http://example.com' });
    expect(mockRun).toHaveBeenCalled();
    expect(newDiapo).toHaveProperty('id');
  });

  it('update returns updated diapo (baseline)', async () => {
    mockRun.mockReturnValueOnce({ changes: 1 });
    const updated = await diapoRepo.update(1, { fichier: 'file.jpg', description: 'Desc' });
    expect(mockRun).toHaveBeenCalled();
    expect(updated).toMatchObject({ id: 1, fichier: 'file.jpg', description: 'Desc', changes: 1 });
  });
});

describe('diapoRepository.update mutations', () => {
  it('returns update result with changes count', async () => {
    mockRun.mockReturnValueOnce({ changes: 2 });
    const result = await diapoRepo.update(3, { fichier: 'a.jpg', description: 'd' });
    expect(mockRun).toHaveBeenCalledWith('a.jpg', 'd', 3);
    expect(result).toEqual({ id: 3, fichier: 'a.jpg', description: 'd', changes: 2 });
  });

  it('throws when id is missing', async () => {
    mockRun.mockImplementationOnce(() => { throw new Error('id'); });
    await expect(diapoRepo.update(undefined, {})).rejects.toThrow('id');
  });
});

describe('diapoRepository.remove', () => {
  it('returns deletion count', async () => {
    mockRun.mockReturnValueOnce({ changes: 1 });
    const result = await diapoRepo.remove(4);
    expect(mockRun).toHaveBeenCalledWith(4);
    expect(result).toEqual({ deleted: 1 });
  });

  it('throws when id is missing', async () => {
    mockRun.mockImplementationOnce(() => { throw new Error('id'); });
    await expect(diapoRepo.remove()).rejects.toThrow('id');
  });
});
