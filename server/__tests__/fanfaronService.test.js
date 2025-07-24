jest.mock('../repositories/fanfaronRepository', () => ({
  findAll: jest.fn(async () => []),
  findAllAnnuaire: jest.fn(async () => []),
  create: jest.fn(),
  update: jest.fn(async (_id, data) => data),
  remove: jest.fn(async () => ({ deleted: 1 })),
}));

const fanfaronRepo = require('../repositories/fanfaronRepository');
const fanfaronService = require('../services/fanfaronService');

describe('fanfaronService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getAllFanfarons maps photoUrl', async () => {
    fanfaronRepo.findAll.mockResolvedValueOnce([{ id: 1, photo: 'a.jpg' }]);
    const res = await fanfaronService.getAllFanfarons();
    expect(res).toEqual([{ id: 1, photo: 'a.jpg', photoUrl: '/public/uploads/fanfarons/a.jpg' }]);
  });

  it('getAllFanfaronsAnnuaire maps photoUrl', async () => {
    fanfaronRepo.findAllAnnuaire.mockResolvedValueOnce([{ id: 2, photo: 'b.jpg' }]);
    const res = await fanfaronService.getAllFanfaronsAnnuaire();
    expect(res).toEqual([{ id: 2, photo: 'b.jpg', photoUrl: '/public/uploads/fanfarons/b.jpg' }]);
  });

  it('updateFanfarons returns updated object with photoUrl', async () => {
    fanfaronRepo.update.mockResolvedValueOnce({ id: 3, photo: 'c.jpg' });
    const res = await fanfaronService.updateFanfarons(3, { photo: 'c.jpg' });
    expect(res).toEqual({ id: 3, photo: 'c.jpg', photoUrl: '/public/uploads/fanfarons/c.jpg' });
  });

  it('deleteFanfarons returns deletion count', async () => {
    fanfaronRepo.remove.mockResolvedValueOnce({ deleted: 1 });
    const res = await fanfaronService.deleteFanfarons(4);
    expect(res).toEqual({ deleted: 1 });
  });
});
