// Tests dédiés au repository d'authentification

const mockPrepare = jest.fn();
const mockGet = jest.fn();
const mockRun = jest.fn();

jest.mock('../../services/databaseService', () => ({
  prepare: mockPrepare,
}));

const authRepo = require('../../repositories/authRepository');

beforeEach(() => {
  mockPrepare.mockReset().mockReturnValue({ get: mockGet, run: mockRun });
  mockGet.mockReset().mockReturnValue({ id: 1, roles: '["fanfaron"]', password_hash: 'hash123' });
  mockRun.mockReset().mockReturnValue({ changes: 1 });
});

describe('authRepository', () => {
  it('findFanfaronBy returns parsed user with roles array', async () => {
    mockGet.mockReturnValueOnce({ id: 1, roles: '["fanfaron","admin"]', password_hash: 'hash123' });
    const user = await authRepo.findFanfaronBy({ field: 'id', value: 1 });
    expect(user.roles).toEqual(['fanfaron', 'admin']);
    expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining('WHERE id = ?'));
  });

  it('findFanfaronBy rejette les champs non autorisés', async () => {
    await expect(authRepo.findFanfaronBy({ field: 'nom', value: 'Dupont' }))
      .rejects.toThrow('Champ non autorisé');
    expect(mockPrepare).not.toHaveBeenCalled();
  });

  it('findFanfaronBy renvoie null si aucun résultat', async () => {
    mockGet.mockReturnValueOnce(null);
    const user = await authRepo.findFanfaronBy({ field: 'email', value: 'none@test' });
    expect(user).toBeNull();
  });

  it('findPasswordHashById returns hash', async () => {
    const hash = await authRepo.findPasswordHashById(1);
    expect(hash).toBe('hash123');
    expect(mockPrepare).toHaveBeenCalledWith('SELECT password_hash FROM fanfarons WHERE id = ?');
  });

  it('updatePasswordById returns true on success', async () => {
    const ok = await authRepo.updatePasswordById(1, 'newHash');
    expect(ok).toBe(true);
    expect(mockRun).toHaveBeenCalledWith('newHash', 1);
  });

  it('parseRoles renvoie [] si JSON invalide', async () => {
    mockGet.mockReturnValueOnce({ id: 2, roles: 'invalid', password_hash: 'hash' });
    const user = await authRepo.findFanfaronBy({ field: 'id', value: 2 });
    expect(user.roles).toEqual([]);
  });
});
