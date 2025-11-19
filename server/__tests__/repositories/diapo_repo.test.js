// Tests fusionnés pour diapoRepository (find/create/update/remove + cas d'erreur)
// Fusion de l'ancien fichier diapo_repo.test.js et diapoRepositoryMutations.test.js

jest.mock('../../services/databaseService', () => {
  const runMock = jest.fn();
  const allMock = jest.fn(() => [
    { id: 1, titre: 'Diapo test', url: 'http://example.com/diapo.jpg' }
  ]);
  return {
    prepare: jest.fn(() => ({
      all: allMock,
      run: runMock,
    }))
  };
});

const { prepare } = require('../../services/databaseService');
const diapoRepo = require('../../repositories/diapoRepository');

function getRunMock() { return prepare.mock.results[prepare.mock.results.length - 1].value.run; }
function getAllMock() { return prepare.mock.results[prepare.mock.results.length - 1].value.all; }

beforeEach(() => {
  jest.clearAllMocks();
});

describe('diapoRepository basic operations', () => {
  it('find returns non-empty array', async () => {
    const rows = await diapoRepo.find({});
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
    expect(getAllMock()).toHaveBeenCalled();
  });

  it('create returns new diapo with id & changes', async () => {
    const runMock = getRunMock();
    runMock.mockReturnValueOnce({ lastInsertRowid: 5, changes: 1 });
    const newDiapo = await diapoRepo.create({ titre: 'New', url: 'http://example.com' });
    expect(runMock).toHaveBeenCalled();
    expect(newDiapo).toHaveProperty('id');
  });

  it('update returns updated diapo (baseline)', async () => {
    const runMock = getRunMock();
    runMock.mockReturnValueOnce({ changes: 1 });
    const updated = await diapoRepo.update(1, { fichier: 'file.jpg', description: 'Desc' });
    expect(runMock).toHaveBeenCalled();
    expect(updated).toMatchObject({ id: 1, fichier: 'file.jpg', description: 'Desc', changes: 1 });
  });
});

describe('diapoRepository.update mutations', () => {
  it('returns update result with changes count', async () => {
    const runMock = getRunMock();
    runMock.mockReturnValueOnce({ changes: 2 });
    const result = await diapoRepo.update(3, { fichier: 'a.jpg', description: 'd' });
    expect(runMock).toHaveBeenCalledWith('a.jpg', 'd', 3);
    expect(result).toEqual({ id: 3, fichier: 'a.jpg', description: 'd', changes: 2 });
  });

  it('throws when id is missing', async () => {
    const runMock = getRunMock();
    runMock.mockImplementationOnce(() => { throw new Error('id'); });
    await expect(diapoRepo.update(undefined, {})).rejects.toThrow('id');
  });
});

describe('diapoRepository.remove', () => {
  it('returns deletion count', async () => {
    const runMock = getRunMock();
    runMock.mockReturnValueOnce({ changes: 1 });
    const result = await diapoRepo.remove(4);
    expect(runMock).toHaveBeenCalledWith(4);
    expect(result).toEqual({ deleted: 1 });
  });

  it('throws when id is missing', async () => {
    const runMock = getRunMock();
    runMock.mockImplementationOnce(() => { throw new Error('id'); });
    await expect(diapoRepo.remove()).rejects.toThrow('id');
  });
});
