const express = require('express');
const request = require('supertest');

const mockProtect = jest.fn((req, _res, next) => { req.user = { id: 1, roles: ['admin','fanfaron'] }; next(); });
const mockAuthorize = jest.fn((roles = []) => (req, res, next) => {
	if (!roles.length) {
		return next();
	}
	const hasRole = req.user?.roles?.some((role) => roles.includes(role));
	if (!hasRole) {
		return res.status(403).json({ message: 'Forbidden' });
	}
	return next();
});

jest.mock('../../controllers/authController', () => ({
	handleLogin: jest.fn((req, res) => res.status(200).end()),
	handleLogout: jest.fn((req, res) => res.status(200).end()),
	handleCheckAuthStatus: jest.fn((req, res) => res.status(200).end()),
	changePassword: jest.fn((req, res) => res.status(200).end()),
	adminSetPassword: jest.fn((req, res) => res.status(200).end()),
}));

jest.mock('../../middleware/authMiddleware', () => ({
	protect: (...args) => mockProtect(...args),
	authorize: (...args) => mockAuthorize(...args),
}));

const authCtrl = require('../../controllers/authController');

const app = express();
app.use(express.json());
app.use('/auth', require('../../routes/authRoutes'));

beforeEach(() => {
	jest.clearAllMocks();
	mockProtect.mockClear();
	mockAuthorize.mockClear();
});

describe('authRoutes', () => {
	it('POST /auth/login appelle handleLogin', async () => {
		const res = await request(app).post('/auth/login').send({ email: 'a', password: 'b' });
		expect(res.status).toBe(200);
		expect(authCtrl.handleLogin).toHaveBeenCalled();
	});

	it('POST /auth/logout passe par protect', async () => {
		const res = await request(app).post('/auth/logout');
		expect(res.status).toBe(200);
		expect(mockProtect).toHaveBeenCalled();
		expect(authCtrl.handleLogout).toHaveBeenCalled();
	});

	it('GET /auth/status utilise protect', async () => {
		const res = await request(app).get('/auth/status');
		expect(res.status).toBe(200);
		expect(mockProtect).toHaveBeenCalled();
		expect(authCtrl.handleCheckAuthStatus).toHaveBeenCalled();
	});

	it('PUT /auth/change-password est protégé', async () => {
		const res = await request(app).put('/auth/change-password').send({ current: 'a', next: 'b' });
		expect(res.status).toBe(200);
		expect(mockProtect).toHaveBeenCalled();
		expect(authCtrl.changePassword).toHaveBeenCalled();
	});

	it('POST /auth/admin-set-password rejette les non-admins', async () => {
		mockProtect.mockImplementationOnce((req, _res, next) => {
			req.user = { id: 1, roles: ['fanfaron'] };
			next();
		});
		const res = await request(app).post('/auth/admin-set-password').send({ userId: 2 });
		expect(res.status).toBe(403);
		expect(authCtrl.adminSetPassword).not.toHaveBeenCalled();
	});

	it('POST /auth/admin-set-password autorise les admins', async () => {
		const res = await request(app).post('/auth/admin-set-password').send({ userId: 2 });
		expect(res.status).toBe(200);
		expect(authCtrl.adminSetPassword).toHaveBeenCalled();
	});
});
