jest.mock('../../repositories/fanfaronRepository', () => ({
  findAll: jest.fn(async () => []),
  findAllAnnuaire: jest.fn(async () => []),
  create: jest.fn(),
  update: jest.fn(async (_id, data) => data),
  remove: jest.fn(async () => ({ deleted: 1 })),
}));

const fanfaronRepo = require('../../repositories/fanfaronRepository');
const fanfaronService = require('../../services/fanfaronService');

describe('fanfaronService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('createFanfarons conserve l\'email fourni et ajoute le rôle fanfaron', async () => {
    const payload = { nom: 'Jean', email: 'jean@test.fr', photo: 'a.jpg' };
    fanfaronRepo.create.mockResolvedValueOnce({ id: 10, ...payload });

    const result = await fanfaronService.createFanfarons(payload);

    expect(fanfaronRepo.create).toHaveBeenCalledWith({ ...payload, roles: JSON.stringify(['fanfaron']) });
    expect(fanfaronRepo.update).not.toHaveBeenCalled();
    expect(result).toEqual({ id: 10, ...payload, photoUrl: '/public/uploads/fanfarons/a.jpg' });
  });

  it('createFanfarons assigne un email par défaut quand il manque', async () => {
    const payload = { nom: 'Marie', email: '   ', photo: 'b.jpg' };
    fanfaronRepo.create.mockResolvedValueOnce({ id: 11, nom: 'Marie', email: null, photo: 'b.jpg' });

    const result = await fanfaronService.createFanfarons(payload);

    expect(fanfaronRepo.create).toHaveBeenCalledWith({ ...payload, email: null, roles: JSON.stringify(['fanfaron']) });
    expect(fanfaronRepo.update).toHaveBeenCalledWith(11, { id: 11, nom: 'Marie', email: 'user11@local', photo: 'b.jpg' });
    expect(result).toEqual({ id: 11, nom: 'Marie', email: 'user11@local', photo: 'b.jpg', photoUrl: '/public/uploads/fanfarons/b.jpg' });
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
