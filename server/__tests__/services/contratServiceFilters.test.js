jest.mock('../../repositories/contratRepository', () => ({
  find: jest.fn(async () => []),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));

const contratRepo = require('../../repositories/contratRepository');

const contratService = require('../../services/contratService');

describe('contratService.list', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('uses defaults for upcoming scope', async () => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-05-06T00:00:00.000Z');
    await contratService.list({ scope: 'upcoming' });
    expect(contratRepo.find).toHaveBeenCalledWith({
      since: '2024-05-06',
      until: undefined,
      order: 'asc',
      limit: 3,
    });
    Date.prototype.toISOString.mockRestore();
  });

  it('uses defaults with empty filters', async () => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-05-06T00:00:00.000Z');
    await contratService.list({});
    expect(contratRepo.find).toHaveBeenCalledWith({
      since: undefined,
      until: undefined,
      order: 'desc',
      limit: undefined,
    });
    Date.prototype.toISOString.mockRestore();
  });

  it('passes provided filters through', async () => {
    await contratService.list({ since: '2023-01-01', until: '2023-12-31', order: 'asc', limit: 10 });
    expect(contratRepo.find).toHaveBeenCalledWith({
      since: '2023-01-01',
      until: '2023-12-31',
      order: 'asc',
      limit: 10,
    });
  });
});
