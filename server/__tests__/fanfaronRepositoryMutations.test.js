jest.mock('../services/databaseService', () => {
  global.runMock = jest.fn();
  global.getMock = jest.fn();
  return { prepare: jest.fn(() => ({ run: global.runMock, get: global.getMock })) };
});

const fanfaronRepo = require('../repositories/fanfaronRepository');

describe('fanfaronRepository.update', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns updated row from database', async () => {
    global.getMock.mockReturnValueOnce({ surnom: 'Joe' });
    const result = await fanfaronRepo.update(5, { surnom: 'Joe' });
    expect(result).toEqual({ surnom: 'Joe' });
    expect(global.runMock).toHaveBeenCalled();
    expect(global.getMock).toHaveBeenCalledWith(5);
  });

  it('throws when id is missing', async () => {
    global.runMock.mockImplementationOnce(() => { throw new Error('id'); });
    await expect(fanfaronRepo.update(undefined, {})).rejects.toThrow('id');
  });
});

describe('fanfaronRepository.remove', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns number of deleted rows', async () => {
    global.runMock.mockReturnValueOnce({ changes: 1 });
    const result = await fanfaronRepo.remove(6);
    expect(global.runMock).toHaveBeenCalledWith(6);
    expect(result).toEqual({ deleted: 1 });
  });

  it('throws when id is missing', async () => {
    global.runMock.mockImplementationOnce(() => { throw new Error('id'); });
    await expect(fanfaronRepo.remove()).rejects.toThrow('id');
  });
});
