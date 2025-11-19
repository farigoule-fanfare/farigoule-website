// Tests fusionnés pour le repository des fanfarons (find/create/update/remove)

const defaultRow = {
  id: 1,
  surnom: 'Joe',
  nom: 'Dupont',
  prenom: 'Jean',
  instrument: 'Trombone',
  promo: '2020',
  bureau: 'Com',
  email: 'joe@example.com',
  tel: '0102030405',
  description: 'desc',
  photo: 'photo.jpg',
  roles: '["member"]',
};

const allMock = jest.fn(() => [defaultRow]);
const getMock = jest.fn(() => defaultRow);
const runMock = jest.fn(() => ({ lastInsertRowid: 1, changes: 1 }));

jest.mock('../../services/databaseService', () => ({
  prepare: jest.fn(() => ({
    all: allMock,
    get: getMock,
    run: runMock,
  })),
}));

const db = require('../../services/databaseService');
const fanfaronRepo = require('../../repositories/fanfaronRepository');
const { prepare } = db;

beforeEach(() => {
  allMock.mockReset().mockReturnValue([defaultRow]);
  getMock.mockReset().mockReturnValue(defaultRow);
  runMock.mockReset().mockReturnValue({ lastInsertRowid: 1, changes: 1 });
  prepare.mockClear();
});

describe('fanfaronRepository - lectures', () => {
  it('findAll returns non-empty array', async () => {
    const rows = await fanfaronRepo.findAll();
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThan(0);
    expect(allMock).toHaveBeenCalled();
  });

  it('findAllAnnuaire returns array', async () => {
    const rows = await fanfaronRepo.findAllAnnuaire();
    expect(Array.isArray(rows)).toBe(true);
    expect(allMock).toHaveBeenCalled();
  });
});

describe('fanfaronRepository - création', () => {
  it('create returns inserted fanfaron with id', async () => {
    runMock.mockReturnValueOnce({ lastInsertRowid: 5, changes: 1 });
    getMock.mockReturnValueOnce({ ...defaultRow, id: 5, nom: 'Test', prenom: 'User' });

    const newFanfaron = await fanfaronRepo.create({ nom: 'Test', prenom: 'User' });

    expect(runMock).toHaveBeenCalled();
    expect(getMock).toHaveBeenCalledWith(5);
    expect(newFanfaron).toMatchObject({ id: 5, nom: 'Test', prenom: 'User' });
  });
});

describe('fanfaronRepository.update', () => {
  it('returns updated row from database', async () => {
    getMock.mockReturnValueOnce({ ...defaultRow, surnom: 'Joe' });

    const result = await fanfaronRepo.update(5, { surnom: 'Joe' });

    expect(runMock).toHaveBeenCalled();
    expect(getMock).toHaveBeenCalledWith(5);
    expect(result).toEqual({ ...defaultRow, surnom: 'Joe' });
  });

  it('throws when id is missing', async () => {
    runMock.mockImplementationOnce(() => { throw new Error('id'); });
    await expect(fanfaronRepo.update(undefined, {})).rejects.toThrow('id');
  });
});

describe('fanfaronRepository.remove', () => {
  it('returns number of deleted rows', async () => {
    runMock.mockReturnValueOnce({ changes: 1 });
    const result = await fanfaronRepo.remove(6);
    expect(runMock).toHaveBeenCalledWith(6);
    expect(result).toEqual({ deleted: 1 });
  });

  it('throws when id is missing', async () => {
    runMock.mockImplementationOnce(() => { throw new Error('id'); });
    await expect(fanfaronRepo.remove()).rejects.toThrow('id');
  });
});
