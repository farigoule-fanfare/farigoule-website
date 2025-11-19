jest.mock('../../repositories/userRepository', () => ({
  updateProfile: jest.fn(),
  findFanfaronById: jest.fn(async id => ({ id, roles: [] })),
  findRolesById: jest.fn(),
  updateRolesById: jest.fn(),
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

  it('removeAdminRole throws if user missing', async () => {
    userRepo.findRolesById.mockResolvedValueOnce(null);
    await expect(userService.removeAdminRole(5))
      .rejects.toThrow('Utilisateur introuvable.');
  });
});
