const express = require('express');
const request = require('supertest');

const mockProtect = jest.fn((req, _res, next) => {
	req.user = { id: 10, roles: ['admin', 'fanfaron'] };
	next();
});

const mockAuthorize = jest.fn((roles = []) => (req, res, next) => {
	if (!roles.length) {
		return next();
	}
	const allowed = req.user?.roles?.some((role) => roles.includes(role));
	if (!allowed) {
		return res.status(403).json({ message: 'Forbidden' });
	}
	return next();
});

const mockPresident = { id: 1, prenom: 'Jean', nom: 'Dupont' };
const mockRolesList = [
	{ id: 2, email: 'user@example.com', roles: ['admin', 'fanfaron'] },
	{ id: 3, email: 'member@example.com', roles: ['fanfaron'] },
];

jest.mock('../../middleware/authMiddleware', () => ({
	protect: (...args) => mockProtect(...args),
	authorize: (...args) => mockAuthorize(...args),
}));

jest.mock('../../controllers/userController', () => ({
	getCurrentPresident: jest.fn((_req, res) => res.status(200).json(mockPresident)),
	updateProfile: jest.fn((req, res) => res.status(200).json({ ...req.body, updatedFor: req.user?.id })),
	listUsersRoles: jest.fn((_req, res) => res.status(200).json(mockRolesList)),
	addAdminRole: jest.fn((_req, res) => res.status(200).json({ message: 'Rôle admin ajouté.' })),
	removeAdminRole: jest.fn((_req, res) => res.status(200).json({ message: 'Rôle admin retiré.' })),
}));

const userCtrl = require('../../controllers/userController');

const app = express();
app.use(express.json());
app.use(require('../../routes'));

beforeEach(() => {
	jest.clearAllMocks();
	mockProtect.mockClear();
	mockAuthorize.mockClear();
});

describe('userRoutes', () => {
	it('GET /users/current-president est public', async () => {
		const res = await request(app).get('/users/current-president');
		expect(res.status).toBe(200);
		expect(res.body).toEqual(mockPresident);
		expect(userCtrl.getCurrentPresident).toHaveBeenCalled();
		expect(mockProtect).not.toHaveBeenCalled();
	});

	it('PATCH /users/profile utilise protect et transmet le body', async () => {
		const payload = { bio: 'Fanfare forever' };
		const res = await request(app).patch('/users/profile').send(payload);
		expect(res.status).toBe(200);
		expect(userCtrl.updateProfile).toHaveBeenCalled();
		const [[reqArg]] = userCtrl.updateProfile.mock.calls;
		expect(reqArg.body).toEqual(payload);
		expect(res.body).toEqual({ ...payload, updatedFor: 10 });
		expect(mockProtect).toHaveBeenCalled();
	});

	it('GET /users/roles nécessite un admin', async () => {
		const res = await request(app).get('/users/roles');
		expect(res.status).toBe(200);
		expect(res.body).toEqual(mockRolesList);
		expect(userCtrl.listUsersRoles).toHaveBeenCalled();
	});

	it('rejette /users/roles pour un membre simple', async () => {
		mockProtect.mockImplementationOnce((req, _res, next) => {
			req.user = { id: 11, roles: ['fanfaron'] };
			next();
		});
		const res = await request(app).get('/users/roles');
		expect(res.status).toBe(403);
		expect(userCtrl.listUsersRoles).not.toHaveBeenCalled();
	});

	it('POST /users/:id/addAdminRole appelle le contrôleur', async () => {
		const res = await request(app).post('/users/5/addAdminRole');
		expect(res.status).toBe(200);
		expect(userCtrl.addAdminRole).toHaveBeenCalled();
		const [[reqArg]] = userCtrl.addAdminRole.mock.calls;
		expect(reqArg.params.id).toBe('5');
	});

	it('POST /users/:id/removeAdminRole appelle le contrôleur', async () => {
		const res = await request(app).post('/users/5/removeAdminRole');
		expect(res.status).toBe(200);
		expect(userCtrl.removeAdminRole).toHaveBeenCalled();
		const [[reqArg]] = userCtrl.removeAdminRole.mock.calls;
		expect(reqArg.params.id).toBe('5');
	});
});
