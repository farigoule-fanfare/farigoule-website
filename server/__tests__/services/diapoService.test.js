// Mock repository to control responses during tests
jest.mock('../../repositories/diapoRepository', () => ({
  create: jest.fn(async data => ({ id: 1, ...data })),
  update: jest.fn(async (id, patch) => ({ id, ...patch })),
  remove: jest.fn(async () => ({ deleted: 1 })),
  find: jest.fn(async () => [
    { id: 1, fichier: 'a.jpg', description: 'A' },
    { id: 2, fichier: 'b.jpg', description: 'B' },
  ]),
}));

const diapoRepo = require('../../repositories/diapoRepository');
const diapoService = require('../../services/diapoService');

beforeEach(() => {
  jest.clearAllMocks();
});
// Unit tests for diapoService methods
describe('diapoService', () => {
  it('list récupère les diapos et ajoute imageUrl', async () => {
    const result = await diapoService.list({ order: 'desc', limit: 10 });
    expect(diapoRepo.find).toHaveBeenCalledWith({ order: 'desc', limit: 10 });
    expect(result).toEqual([
      { id: 1, fichier: 'a.jpg', description: 'A', imageUrl: '/public/uploads/carousel/a.jpg' },
      { id: 2, fichier: 'b.jpg', description: 'B', imageUrl: '/public/uploads/carousel/b.jpg' },
    ]);
  });

  it('addDiapo returns enriched data and calls create', async () => {
    const payload = { fichier: 'a.jpg', description: 'A' };
    const result = await diapoService.addDiapo(payload);
    expect(diapoRepo.create).toHaveBeenCalledWith(payload);
    expect(result).toEqual({
      id: 1,
      fichier: 'a.jpg',
      description: 'A',
      imageUrl: '/public/uploads/carousel/a.jpg',
    });
  });

  it('updateDiapo returns enriched data and calls update', async () => {
    const patch = { fichier: 'b.jpg', description: 'B' };
    const result = await diapoService.updateDiapo(2, patch);
    expect(diapoRepo.update).toHaveBeenCalledWith(2, patch);
    expect(result).toEqual({
      id: 2,
      fichier: 'b.jpg',
      description: 'B',
      imageUrl: '/public/uploads/carousel/b.jpg',
    });
  });

  it('deleteDiapo calls remove and returns its result', async () => {
    const result = await diapoService.deleteDiapo(3);
    expect(diapoRepo.remove).toHaveBeenCalledWith(3);
    expect(result).toEqual({ deleted: 1 });
  });
});
