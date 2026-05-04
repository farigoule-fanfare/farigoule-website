jest.mock('../../repositories/userRepository', () => ({
  updateProfile: jest.fn(),
  findFanfaronById: jest.fn(async id => ({ id, roles: [] })),
  findRolesById: jest.fn(),
  updateRolesById: jest.fn(),
  getCurrentPresident: jest.fn(async () => ({ id: 1, nom: 'Prez' })),
  findAllUsersRoles: jest.fn(async () => [{ id: 1, roles: ['admin'] }]),
}));

const userRepo = require('../../repositories/userRepository');

const userService = require('../../services/userService');

describe('userService.updateProfile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('filters allowed fields and returns updated user', async () => {
    const result = await userService.updateProfile(1, {
      nom: 'Doe',
      telephone: '123',
      inconnu: 'x',
    });
    expect(userRepo.updateProfile).toHaveBeenCalledWith(1, {
      nom: 'Doe',
      telephone: '123',
    });
    expect(result).toEqual({ id: 1, roles: [] });
  });

  it('throws when no valid fields provided', async () => {
    await expect(userService.updateProfile(1, { foo: 'bar' }))
      .rejects.toThrow('Aucun champ valide fourni.');
  });

  it('translates email constraint error', async () => {
    const err = new Error('email');
    err.code = 'SQLITE_CONSTRAINT';
    userRepo.updateProfile.mockImplementationOnce(() => { throw err; });
    await expect(userService.updateProfile(1, { email: 'a@b.com' }))
      .rejects.toThrow('Cet e-mail est déjà utilisé.');
  });
  it('propagates unexpected errors from repository', async () => {
    const err = new Error('DB down');
    userRepo.updateProfile.mockImplementationOnce(() => { throw err; });
    await expect(userService.updateProfile(1, { nom: 'Doe' }))
      .rejects.toThrow('DB down');
  });
});

describe('userService admin role management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('addAdminRole throws if user missing', async () => {
    userRepo.findRolesById.mockResolvedValueOnce(null);
    await expect(userService.addAdminRole(5))
      .rejects.toThrow('Utilisateur introuvable.');
  });

  it('addAdminRole retourne les rôles mis à jour', async () => {
    userRepo.findRolesById.mockResolvedValueOnce({ id: 6, roles: ['fanfaron'] });
    userRepo.updateRolesById.mockResolvedValueOnce();
    const res = await userService.addAdminRole(6);
    expect(userRepo.updateRolesById).toHaveBeenCalledWith(6, ['fanfaron', 'admin']);
    expect(res.roles).toEqual(['fanfaron', 'admin']);
  });

  it('removeAdminRole throws if user missing', async () => {
    userRepo.findRolesById.mockResolvedValueOnce(null);
    await expect(userService.removeAdminRole(5))
      .rejects.toThrow('Utilisateur introuvable.');
  });

  it('removeAdminRole met à jour les rôles quand admin présent', async () => {
    userRepo.findRolesById.mockResolvedValueOnce({ id: 7, roles: ['admin', 'fanfaron'] });
    const res = await userService.removeAdminRole(7);
    expect(userRepo.updateRolesById).toHaveBeenCalledWith(7, ['fanfaron']);
    expect(res.roles).toEqual(['fanfaron']);
  });
});

describe('userService read helpers', () => {
  it('getCurrentPresident délègue au repository', async () => {
    const prez = await userService.getCurrentPresident();
    expect(userRepo.getCurrentPresident).toHaveBeenCalled();
    expect(prez).toEqual({ id: 1, nom: 'Prez' });
  });

  it('getAllUsersRoles retourne la liste des rôles', async () => {
    const roles = await userService.getAllUsersRoles();
    expect(userRepo.findAllUsersRoles).toHaveBeenCalled();
    expect(roles).toEqual([{ id: 1, roles: ['admin'] }]);
  });

  it('findRolesById renvoie la valeur du repo', async () => {
    userRepo.findRolesById.mockResolvedValueOnce({ id: 9, roles: [] });
    const res = await userService.findRolesById(9);
    expect(userRepo.findRolesById).toHaveBeenCalledWith(9);
    expect(res).toEqual({ id: 9, roles: [] });
  });
});
