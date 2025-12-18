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

  it('uses defaults for past scope', async () => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-05-06T00:00:00.000Z');
    await contratService.list({ scope: 'past' });
    expect(contratRepo.find).toHaveBeenCalledWith({
      since: undefined,
      until: '2024-05-06',
      order: 'desc',
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

  it('does not override since when provided with upcoming scope', async () => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-05-06T00:00:00.000Z');
    await contratService.list({ scope: 'upcoming', since: '2024-06-01' });
    expect(contratRepo.find).toHaveBeenCalledWith({
      since: '2024-06-01',
      until: undefined,
      order: 'asc',
      limit: 3,
    });
    Date.prototype.toISOString.mockRestore();
  });

  it('does not override until when provided with past scope', async () => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-05-06T00:00:00.000Z');
    await contratService.list({ scope: 'past', until: '2024-05-01' });
    expect(contratRepo.find).toHaveBeenCalledWith({
      since: undefined,
      until: '2024-05-01',
      order: 'desc',
      limit: 3,
    });
    Date.prototype.toISOString.mockRestore();
  });

  it('uses provided order over default', async () => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-05-06T00:00:00.000Z');
    await contratService.list({ scope: 'upcoming', order: 'desc' });
    expect(contratRepo.find).toHaveBeenCalledWith({
      since: '2024-05-06',
      until: undefined,
      order: 'desc',
      limit: 3,
    });
    Date.prototype.toISOString.mockRestore();
  });

  it('does not apply default limit when no scope', async () => {
    await contratService.list({ limit: 5 });
    expect(contratRepo.find).toHaveBeenCalledWith({
      since: undefined,
      until: undefined,
      order: 'desc',
      limit: 5,
    });
  });
});

describe('contratService CRUD helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('addContrat délègue à contratRepo.create', async () => {
    const payload = { date: '2025-01-01', lieu: 'Paris', description: 'Concert' };
    await contratService.addContrat(payload);
    expect(contratRepo.create).toHaveBeenCalledWith(payload);
  });

  it('addContrat rejette une date invalide', () => {
    const payload = { date: 'not-a-date', lieu: 'Paris', description: 'Concert' };
    expect(() => contratService.addContrat(payload)).toThrow('date must be a valid ISO date (YYYY-MM-DD)');
    expect(contratRepo.create).not.toHaveBeenCalled();
  });

  it('addContrat rejette une date avec mauvais format', () => {
    const payload = { date: '2025/01/01', lieu: 'Paris', description: 'Concert' };
    expect(() => contratService.addContrat(payload)).toThrow('date must be a valid ISO date (YYYY-MM-DD)');
    expect(contratRepo.create).not.toHaveBeenCalled();
  });

  it('addContrat rejette une date invalide (jour inexistant)', () => {
    const payload = { date: '2025-02-30', lieu: 'Paris', description: 'Concert' };
    expect(() => contratService.addContrat(payload)).toThrow('date must be a valid ISO date (YYYY-MM-DD)');
    expect(contratRepo.create).not.toHaveBeenCalled();
  });

  it('updateContrat délègue à contratRepo.update et retourne l\'objet mis à jour', async () => {
    const payload = { date: '2025-05-05', lieu: 'Lyon' };
    const result = await contratService.updateContrat(4, payload);
    expect(contratRepo.update).toHaveBeenCalledWith(4, payload);
    expect(result).toEqual({ id: 4, ...payload });
  });

  it('updateContrat rejette une date invalide', async () => {
    const payload = { date: '2025-13-40', lieu: 'Lyon', description: 'Test' };
    await expect(contratService.updateContrat(4, payload)).rejects.toThrow('date must be a valid ISO date (YYYY-MM-DD)');
    expect(contratRepo.update).not.toHaveBeenCalled();
  });

  it('deleteContrat délègue à contratRepo.remove', async () => {
    await contratService.deleteContrat(9);
    expect(contratRepo.remove).toHaveBeenCalledWith(9);
  });
});

describe('contratService - Test des lignes spécifiques', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test de la ligne: else if (scope === 'past') until = today;
  it('else if (scope === "past") sets until to today', async () => {
    jest.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-12-18T00:00:00.000Z');
    await contratService.list({ scope: 'past' });
    expect(contratRepo.find).toHaveBeenCalledWith({
      since: undefined,
      until: '2024-12-18',
      order: 'desc',
      limit: 3,
    });
    Date.prototype.toISOString.mockRestore();
  });

  // Test de la ligne: if (typeof value !== 'string') return false;
  it('rejects non-string dates (number, null, undefined, object, array)', () => {
    expect(() => contratService.addContrat({ date: 12345 })).toThrow('date must be a valid ISO date (YYYY-MM-DD)');
    expect(() => contratService.addContrat({ date: null })).toThrow('date must be a valid ISO date (YYYY-MM-DD)');
    expect(() => contratService.addContrat({ date: undefined })).toThrow('date must be a valid ISO date (YYYY-MM-DD)');
    expect(() => contratService.addContrat({ date: {} })).toThrow('date must be a valid ISO date (YYYY-MM-DD)');
    expect(() => contratService.addContrat({ date: [] })).toThrow('date must be a valid ISO date (YYYY-MM-DD)');
  });

  // Test de la ligne: const { date } = data
  it('correctly extracts date from data object', async () => {
    const payload = { date: '2025-06-15', description: 'Test event' };
    await contratService.addContrat(payload);
    expect(contratRepo.create).toHaveBeenCalledWith(payload);
  });
});
