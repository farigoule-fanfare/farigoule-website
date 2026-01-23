const express = require('express');
const request = require('supertest');

const mockProtect = jest.fn((req, _res, next) => {
	req.user = { id: 1, roles: ['admin', 'fanfaron'] };
	next();
});

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

const mockSampleCitations = [
	{ id: 1, citation: 'Toujours plus haut', auteur_id: 7, auteurCitation: 'Frédo' },
	{ id: 2, citation: 'Jamais sans ma fanfare', auteur_id: null, auteurCitation: 'Anonyme' },
];

const mockRandomCitationPayload = mockSampleCitations[0];

jest.mock('../../controllers/citationsController', () => ({
	randomCitation: jest.fn((_req, res) => res.status(200).json(mockRandomCitationPayload)),
	listCitations: jest.fn((_req, res) => res.status(200).json(mockSampleCitations)),
	addCitation: jest.fn((req, res) => {
		const created = { id: 99, ...req.body };
		return res.status(201).json(created);
	}),
	updateCitation: jest.fn((req, res) => res.status(200).json({ changes: 1, id: Number(req.params.id) })),
	deleteCitation: jest.fn((_req, res) => res.status(200).json({ deleted: 1 })),
}));

jest.mock('../../middleware/authMiddleware', () => ({
	protect: (...args) => mockProtect(...args),
	authorize: (...args) => mockAuthorize(...args),
}));

const ctrl = require('../../controllers/citationsController');

const app = express();
app.use(express.json());
app.use('/citations', require('../../routes/citationsRoutes'));

beforeEach(() => {
	jest.clearAllMocks();
	mockProtect.mockClear();
	mockAuthorize.mockClear();
});

describe('citationsRoutes', () => {
	it('GET /citations expose randomCitation sans auth', async () => {
		const res = await request(app).get('/citations');
		expect(res.status).toBe(200);
		expect(ctrl.randomCitation).toHaveBeenCalled();
		expect(res.body).toEqual(mockRandomCitationPayload);
		expect(mockProtect).not.toHaveBeenCalled();
	});

	it('rejette GET /citations/ordered pour un non-admin', async () => {
		mockProtect.mockImplementationOnce((req, _res, next) => {
			req.user = { id: 2, roles: ['fanfaron'] };
			next();
		});
		const res = await request(app).get('/citations/ordered');
		expect(res.status).toBe(403);
		expect(ctrl.listCitations).not.toHaveBeenCalled();
	});

	it('autorise GET /citations/ordered pour un admin', async () => {
		const res = await request(app).get('/citations/ordered');
		expect(res.status).toBe(200);
		expect(ctrl.listCitations).toHaveBeenCalled();
		expect(res.body).toEqual(mockSampleCitations);
	});

	it('POST /citations appelle addCitation pour un admin', async () => {
		const payload = { citation: 'Salut', auteur_id: 3 };
		const res = await request(app).post('/citations').send(payload);
		expect(res.status).toBe(201);
		expect(ctrl.addCitation).toHaveBeenCalled();
		const [[req]] = ctrl.addCitation.mock.calls;
		expect(req.body).toEqual(payload);
		expect(res.body).toEqual({ id: 99, ...payload });
	});

	it('PATCH /citations/:id met à jour la citation', async () => {
		const payload = { citation: 'Updated', auteur_id: null };
		const res = await request(app).patch('/citations/42').send(payload);
		expect(res.status).toBe(200);
		expect(ctrl.updateCitation).toHaveBeenCalled();
		const [[req]] = ctrl.updateCitation.mock.calls;
		expect(req.params.id).toBe('42');
		expect(req.body).toEqual(payload);
		expect(res.body).toEqual({ changes: 1, id: 42 });
	});

	it('DELETE /citations/:id supprime la citation', async () => {
		const res = await request(app).delete('/citations/42');
		expect(res.status).toBe(200);
		expect(ctrl.deleteCitation).toHaveBeenCalled();
		expect(res.body).toEqual({ deleted: 1 });
	});
});
