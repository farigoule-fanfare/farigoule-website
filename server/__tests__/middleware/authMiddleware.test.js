// Tests du middleware d'authentification

jest.mock('../../services/authService', () => ({
	verifyToken: jest.fn(),
	getUserById: jest.fn(),
}));

const authService = require('../../services/authService');
const { protect, authorize } = require('../../middleware/authMiddleware');

function resMock() {
	const res = {};
	res.status = jest.fn(() => res);
	res.json = jest.fn(() => res);
	return res;
}

describe('protect middleware', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('accepte un token Bearer et attache req.user', async () => {
		const req = { headers: { authorization: 'Bearer token123' } };
		const res = resMock();
		const next = jest.fn();
		authService.verifyToken.mockResolvedValueOnce({ id: 7 });
		authService.getUserById.mockResolvedValueOnce({ id: 7, roles: ['admin'] });

		await protect(req, res, next);

		expect(authService.verifyToken).toHaveBeenCalledWith('token123');
		expect(authService.getUserById).toHaveBeenCalledWith(7);
		expect(req.user).toEqual({ id: 7, roles: ['admin'] });
		expect(next).toHaveBeenCalled();
	});

	it('utilise le cookie authToken si pas de header', async () => {
		const req = { headers: {}, cookies: { authToken: 'cookie-token' } };
		const res = resMock();
		const next = jest.fn();
		authService.verifyToken.mockResolvedValueOnce({ id: 9 });
		authService.getUserById.mockResolvedValueOnce({ id: 9, roles: ['member'] });

		await protect(req, res, next);

		expect(authService.verifyToken).toHaveBeenCalledWith('cookie-token');
		expect(next).toHaveBeenCalled();
	});

	it('retourne 401 si aucun token fourni', async () => {
		const req = { headers: {} };
		const res = resMock();
		const next = jest.fn();

		await protect(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no token' });
		expect(next).not.toHaveBeenCalled();
	});

	it('retourne 401 si utilisateur inexistant', async () => {
		const req = { headers: { authorization: 'Bearer xyz' } };
		const res = resMock();
		const next = jest.fn();
		authService.verifyToken.mockResolvedValueOnce({ id: 5 });
		authService.getUserById.mockResolvedValueOnce(null);

		await protect(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, user not found' });
		expect(next).not.toHaveBeenCalled();
	});

	it('retourne 401 si verifyToken lève', async () => {
		const req = { headers: { authorization: 'Bearer bad' } };
		const res = resMock();
		const next = jest.fn();
		authService.verifyToken.mockRejectedValueOnce(new Error('Token invalide'));

		await protect(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: 'Token invalide' });
		expect(next).not.toHaveBeenCalled();
	});
});

describe('authorize middleware', () => {
	it('laisse passer quand le rôle requis est présent', () => {
		const req = { user: { roles: ['admin', 'member'] } };
		const res = resMock();
		const next = jest.fn();

		authorize(['admin'])(req, res, next);

		expect(next).toHaveBeenCalled();
	});

	it('renvoie 401 si req.user absent', () => {
		const req = {};
		const res = resMock();
		const next = jest.fn();

		authorize(['admin'])(req, res, next);

		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ message: 'Not authorized, no user session' });
		expect(next).not.toHaveBeenCalled();
	});

	it('renvoie 403 si aucun rôle requis n’est présent', () => {
		const req = { user: { roles: ['member'] } };
		const res = resMock();
		const next = jest.fn();

		authorize(['admin', 'super'])(req, res, next);

		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.json).toHaveBeenCalledWith({
			message: 'Forbidden, user does not have the required role.',
			requiredOneOf: ['admin', 'super'],
			userRoles: ['member'],
		});
		expect(next).not.toHaveBeenCalled();
	});
});
