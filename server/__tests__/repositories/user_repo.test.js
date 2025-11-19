// Tests fusionnés pour userRepository (select + updates)

const getMock = jest.fn();
const allMock = jest.fn();
const runMock = jest.fn();

jest.mock('../../services/databaseService', () => ({
  prepare: jest.fn(() => ({
    get: getMock,
    all: allMock,
    run: runMock,
  })),
}));

const db = require('../../services/databaseService');
const { prepare } = db;
const userRepo = require('../../repositories/userRepository');

const defaultUser = { id: 1, roles: '["admin"]', nom: 'Dupont' };

beforeEach(() => {
  getMock.mockReset().mockReturnValue(defaultUser);
  allMock.mockReset().mockReturnValue([defaultUser]);
  runMock.mockReset().mockReturnValue({ changes: 1 });
  prepare.mockClear();
});

describe('userRepository - sélections', () => {
  it('findRolesById parse les rôles', async () => {
    getMock.mockReturnValueOnce({ id: 1, roles: '["admin","president"]' });
    const user = await userRepo.findRolesById(1);
    expect(user).toEqual({ id: 1, roles: ['admin', 'president'] });
    expect(prepare).toHaveBeenCalledWith('SELECT id, roles FROM fanfarons WHERE id = ?');
  });

  it('findRolesById retourne null sans id', async () => {
    const user = await userRepo.findRolesById();
    expect(user).toBeNull();
    expect(getMock).not.toHaveBeenCalled();
  });

  it('findFanfaronById retourne identités + roles[]', async () => {
    getMock.mockReturnValueOnce({ id: 2, nom: 'Doe', prenom: 'Jane', email: 'jane@example.com', tel: '123' });
    const fanfaron = await userRepo.findFanfaronById(2);
    expect(fanfaron).toEqual({ id: 2, nom: 'Doe', prenom: 'Jane', email: 'jane@example.com', tel: '123', roles: [] });
    expect(prepare).toHaveBeenCalledWith('SELECT id, nom, prenom, email, tel FROM fanfarons WHERE id = ?');
  });

  it('findAllUsersRoles retourne un tableau avec roles parsés', async () => {
    allMock.mockReturnValueOnce([
      { id: 1, surnom: 'Joe', promo: '2020', roles: '["admin"]' },
      { id: 2, surnom: 'Ann', promo: '2021', roles: '["member","staff"]' },
    ]);
    const rows = await userRepo.findAllUsersRoles();
    expect(rows).toEqual([
      { id: 1, surnom: 'Joe', promo: '2020', roles: ['admin'] },
      { id: 2, surnom: 'Ann', promo: '2021', roles: ['member', 'staff'] },
    ]);
    expect(prepare).toHaveBeenCalledWith('SELECT id, surnom, promo, roles FROM fanfarons');
  });

  it('getCurrentPresident renvoie la ligne récupérée', async () => {
    const presidentRow = { surnom: 'Prez', prenom: 'Paul', nom: 'Prez', email: 'prez@example.com', tel: '0102' };
    getMock.mockReturnValueOnce(presidentRow);
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
    expect(runMock).toHaveBeenCalledWith('Doe', '123', 3);
  });

  it('updateProfile lance une erreur sans champs', () => {
    expect(() => userRepo.updateProfile(1, {})).toThrow('Aucun champ à mettre à jour');
    expect(runMock).not.toHaveBeenCalled();
  });

  it('updateProfile lance une erreur sans id', () => {
    expect(() => userRepo.updateProfile(undefined, { nom: 'Nope' })).toThrow('id manquant');
    expect(runMock).not.toHaveBeenCalled();
  });

  it('updateRolesById sérialise les rôles', () => {
    userRepo.updateRolesById(2, ['admin']);
    const lastQuery = prepare.mock.calls[0][0];
    expect(lastQuery).toBe('UPDATE fanfarons SET roles = ? WHERE id = ?');
    expect(runMock).toHaveBeenCalledWith('["admin"]', 2);
  });

  it('updateRolesById remplace par tableau vide si undefined', () => {
    userRepo.updateRolesById(4);
    expect(runMock).toHaveBeenCalledWith('[]', 4);
  });
});
