jest.mock('../services/databaseService', () => {
  global.runMock = jest.fn();
  return { prepare: jest.fn(() => ({ run: global.runMock })) };
});

const diapoRepo = require('../repositories/diapoRepository');

describe('diapoRepository.update', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns update result with changes count', async () => {
    global.runMock.mockReturnValueOnce({ changes: 2 });
    const result = await diapoRepo.update(3, { fichier: 'a.jpg', description: 'd' });
    expect(global.runMock).toHaveBeenCalledWith('a.jpg', 'd', 3);
    expect(result).toEqual({ id: 3, fichier: 'a.jpg', description: 'd', changes: 2 });
  });

  it('throws when id is missing', async () => {
    global.runMock.mockImplementationOnce(() => { throw new Error('id'); });
    await expect(diapoRepo.update(undefined, {})).rejects.toThrow('id');
  });
});

describe('diapoRepository.remove', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns deletion count', async () => {
    global.runMock.mockReturnValueOnce({ changes: 1 });
    const result = await diapoRepo.remove(4);
    expect(global.runMock).toHaveBeenCalledWith(4);
    expect(result).toEqual({ deleted: 1 });
  });

  it('throws when id is missing', async () => {
    global.runMock.mockImplementationOnce(() => { throw new Error('id'); });
    await expect(diapoRepo.remove()).rejects.toThrow('id');
  });
});
