// Tests fusionnés pour userRepository (select + updates)

const mockGet = jest.fn();
const mockAll = jest.fn();
const mockRun = jest.fn();

jest.mock('../../services/databaseService', () => ({
  prepare: jest.fn(() => ({
    get: mockGet,
    all: mockAll,
    run: mockRun,
  })),
}));

const db = require('../../services/databaseService');
const { prepare } = db;
const userRepo = require('../../repositories/userRepository');

const defaultUser = { id: 1, roles: '["fanfaron"]', nom: 'Dupont' };

beforeEach(() => {
  mockGet.mockReset().mockReturnValue(defaultUser);
  mockAll.mockReset().mockReturnValue([defaultUser]);
  mockRun.mockReset().mockReturnValue({ changes: 1 });
  prepare.mockClear();
});

describe('userRepository - sélections', () => {
  it('findRolesById parse les rôles', async () => {
    mockGet.mockReturnValueOnce({ id: 1, roles: '["admin","fanfaron"]' });
    const user = await userRepo.findRolesById(1);
    expect(user).toEqual({ id: 1, roles: ['admin', 'fanfaron'] });
    expect(prepare).toHaveBeenCalledWith('SELECT id, roles FROM fanfarons WHERE id = ?');
  });

  it('findRolesById retourne null sans id', async () => {
    const user = await userRepo.findRolesById();
    expect(user).toBeNull();
    expect(mockGet).not.toHaveBeenCalled();
  });

  it('findFanfaronById retourne identités + roles[]', async () => {
    mockGet.mockReturnValueOnce({ id: 2, nom: 'Doe', prenom: 'Jane', email: 'jane@example.com', tel: '123' });
    const fanfaron = await userRepo.findFanfaronById(2);
    expect(fanfaron).toEqual({ id: 2, nom: 'Doe', prenom: 'Jane', email: 'jane@example.com', tel: '123', roles: [] });
    expect(prepare).toHaveBeenCalledWith('SELECT id, nom, prenom, email, tel FROM fanfarons WHERE id = ?');
  });

  it('findFanfaronById retourne null si rien trouvé', async () => {
    mockGet.mockReturnValueOnce(null);
    const fanfaron = await userRepo.findFanfaronById(99);
    expect(fanfaron).toBeNull();
  });

  it('findAllUsersRoles retourne un tableau avec roles parsés', async () => {
    mockAll.mockReturnValueOnce([
      { id: 1, surnom: 'Joe', promo: '2020', roles: '["fanfaron"]' },
      { id: 2, surnom: 'Ann', promo: '2021', roles: '["fanfaron","admin"]' },
    ]);
    const rows = await userRepo.findAllUsersRoles();
    expect(rows).toEqual([
      { id: 1, surnom: 'Joe', promo: '2020', roles: ['fanfaron'] },
      { id: 2, surnom: 'Ann', promo: '2021', roles: ['fanfaron', 'admin'] },
    ]);
    expect(prepare).toHaveBeenCalledWith('SELECT id, surnom, promo, roles FROM fanfarons');
  });

  it('getCurrentPresident renvoie la ligne récupérée', async () => {
    const presidentRow = { surnom: 'Prez', prenom: 'Paul', nom: 'Prez', email: 'prez@example.com', tel: '0102' };
    mockGet.mockReturnValueOnce(presidentRow);
    const president = await userRepo.getCurrentPresident();
    expect(president).toBe(presidentRow);
    expect(prepare.mock.calls[0][0]).toContain('WHERE lower(bureau) LIKE');
  });
});

describe('userRepository - updates', () => {
  it('updateProfile construit la requête SET pour les champs fournis', () => {
    userRepo.updateProfile(3, { nom: 'Doe', telephone: '123' });
    const lastQuery = prepare.mock.calls[0][0];
    expect(lastQuery).toBe('UPDATE fanfarons SET nom = ?, tel = ? WHERE id = ?');
    expect(mockRun).toHaveBeenCalledWith('Doe', '123', 3);
  });

  it('updateProfile ignore les champs undefined mais gère plusieurs colonnes', () => {
    userRepo.updateProfile(4, { nom: 'Dupont', prenom: undefined, email: 'dupont@test.fr', telephone: '0102' });
    const lastQuery = prepare.mock.calls[0][0];
    expect(lastQuery).toBe('UPDATE fanfarons SET nom = ?, email = ?, tel = ? WHERE id = ?');
    expect(mockRun).toHaveBeenCalledWith('Dupont', 'dupont@test.fr', '0102', 4);
  });

  it('updateProfile lance une erreur sans champs', () => {
    expect(() => userRepo.updateProfile(1, {})).toThrow('Aucun champ à mettre à jour');
    expect(mockRun).not.toHaveBeenCalled();
  });

  it('updateProfile lance une erreur sans id', () => {
    expect(() => userRepo.updateProfile(undefined, { nom: 'Nope' })).toThrow('id manquant');
    expect(mockRun).not.toHaveBeenCalled();
  });

  it('updateRolesById sérialise les rôles', () => {
    userRepo.updateRolesById(1, ['fanfaron', 'admin']);
    const lastQuery = prepare.mock.calls[0][0];
    expect(lastQuery).toBe('UPDATE fanfarons SET roles = ? WHERE id = ?');
    expect(mockRun).toHaveBeenCalledWith('["fanfaron","admin"]', 1);
  });

  it('updateRolesById remplace par tableau vide si undefined', () => {
    userRepo.updateRolesById(4);
    expect(mockRun).toHaveBeenCalledWith('[]', 4);
  });
});
