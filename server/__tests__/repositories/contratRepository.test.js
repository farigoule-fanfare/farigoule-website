// Tests dédiés au repository des contrats

const mockPrepare = jest.fn();

jest.mock('../../services/databaseService', () => ({
  prepare: mockPrepare,
}));

const db = require('../../services/databaseService');
const contratRepo = require('../../repositories/contratRepository');

function setupPrepare({ allResult = [], runResult = { lastInsertRowid: 1, changes: 1 } } = {}) {
  const all = jest.fn().mockReturnValue(allResult);
  const run = jest.fn().mockReturnValue(runResult);
  mockPrepare.mockReturnValue({ all, run });
  return { all, run };
}

beforeEach(() => {
  mockPrepare.mockReset();
});

describe('contratRepository', () => {
  it('find returns array of contrats', async () => {
    const { all } = setupPrepare({ allResult: [{ id: 1, titre: 'Contrat test', date: '2025-01-01' }] });
    const rows = await contratRepo.find({});
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
    expect(all).toHaveBeenCalledWith();
  });

  it('find applique since/until/order/limit dans la requête', async () => {
    const { all } = setupPrepare();
    await contratRepo.find({ since: '2025-01-01', until: '2025-02-01', order: 'asc', limit: 5 });

    expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('WHERE date >= ? AND date <'));
    expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('ORDER BY date ASC'));
    expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('LIMIT ?'));
    expect(all).toHaveBeenCalledWith('2025-01-01', '2025-02-01', 5);
  });

  it('create returns new contrat with id', async () => {
    const { run } = setupPrepare();
    const newContrat = await contratRepo.create({ titre: 'New', date: '2025-01-01', lieu: 'Paris', description: 'Test' });
    expect(newContrat).toHaveProperty('id');
    expect(run).toHaveBeenCalledWith('2025-01-01', 'Paris', 'Test');
  });

  it('update returns updated contrat', async () => {
    const { run } = setupPrepare({ runResult: { changes: 1 } });
    const updated = await contratRepo.update(1, { date: '2025-01-02', lieu: 'Lyon', description: 'Modif' });
    expect(updated).toEqual({ changes: 1 });
    expect(run).toHaveBeenCalledWith('2025-01-02', 'Lyon', 'Modif', 1);
  });

  it('remove supprime un contrat et retourne le nombre supprimé', async () => {
    const { run } = setupPrepare({ runResult: { changes: 2 } });
    const res = await contratRepo.remove(7);
    expect(run).toHaveBeenCalledWith(7);
    expect(res).toEqual({ deleted: 2 });
  });
});
