jest.mock('../../services/citationService', () => ({
  list: jest.fn(async () => [ { id: 10, citation: 'Tempus fugit', auteur_id: 2 } ]),
  random: jest.fn(async () => ({ id: 10, citation: 'Tempus fugit', auteur_id: 2 })),
  addCitation: jest.fn(async d => d),
  updateCitation: jest.fn(async () => ({ success: true })),
  deleteCitation: jest.fn(async () => ({ success: true }))
}));

const citationCtrl = require('../../controllers/citationsController');
const citationService = require('../../services/citationService');

function resMock() {
	const res = {};
	res.status = jest.fn(() => res);
	res.json = jest.fn(() => res);
	return res;
}

describe('citationsController (isolé)', () => {
	it('listCitations retourne une liste non vide', async () => {
		const res = resMock();
		await citationCtrl.listCitations({}, res);
		expect(res.status).toHaveBeenCalledWith(200);
		const payload = res.json.mock.calls[0][0];
		expect(Array.isArray(payload)).toBe(true);
		expect(payload.length).toBeGreaterThan(0);
	});

	it('randomCitation retourne un objet citation', async () => {
		const res = resMock();
		await citationCtrl.randomCitation({}, res);
		expect(res.status).toHaveBeenCalledWith(200);
		const obj = res.json.mock.calls[0][0];
		expect(obj).toHaveProperty('citation');
	});

		it('addCitation crée et renvoie la citation (201)', async () => {
			const res = resMock();
			const req = { body: { citation: 'Carpe diem', auteur_id: 5 } };
			await citationCtrl.addCitation(req, res);
			expect(res.status).toHaveBeenCalledWith(201);
			expect(res.json).toHaveBeenCalledWith({ citation: 'Carpe diem', auteur_id: 5 });
		});

		it('updateCitation met à jour (200)', async () => {
			const res = resMock();
			const req = { params: { id: '10' }, body: { citation: 'Tempus fugit (edit)', auteur_id: 2 } };
			await citationCtrl.updateCitation(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			const payload = res.json.mock.calls[0][0];
			expect(payload).toHaveProperty('success');
		});

		it('deleteCitation supprime (200)', async () => {
			const res = resMock();
			const req = { params: { id: '10' } };
			await citationCtrl.deleteCitation(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			const payload = res.json.mock.calls[0][0];
			expect(payload).toHaveProperty('success');
		});

	it('listCitations gère une erreur du service', async () => {
		citationService.list.mockRejectedValueOnce(new Error('DB down'));
		const res = resMock();
		await citationCtrl.listCitations({}, res);
		expect(res.status).toHaveBeenCalledWith(500);
		expect(res.json).toHaveBeenCalledWith({ message: 'Unable to fetch citations' });
	});
});
