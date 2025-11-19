jest.mock('../../repositories/citationRepository', () => ({
	findAll: jest.fn(async () => [{ id: 1, citation: 'Yo', auteur_id: null }]),
	findRandom: jest.fn(async () => ({ id: 2, citation: 'Random', auteur_id: 3 })),
	create: jest.fn(async (payload) => ({ id: 3, ...payload })),
	update: jest.fn(async (id, payload) => ({ id, ...payload })),
	remove: jest.fn(async (id) => ({ deleted: 1, id })),
}));

const citationRepo = require('../../repositories/citationRepository');
const citationService = require('../../services/citationService');

describe('citationService', () => {
	it('list renvoie toutes les citations', async () => {
		const rows = await citationService.list();
		expect(citationRepo.findAll).toHaveBeenCalled();
		expect(rows).toHaveLength(1);
	});

	it('random renvoie une citation', async () => {
		const row = await citationService.random();
		expect(citationRepo.findRandom).toHaveBeenCalled();
		expect(row).toHaveProperty('id', 2);
	});

	it('addCitation délègue au repository', async () => {
		const payload = { citation: 'Salut', auteur_id: 7 };
		const created = await citationService.addCitation(payload);
		expect(citationRepo.create).toHaveBeenCalledWith(payload);
		expect(created).toMatchObject(payload);
	});

	it('updateCitation délègue au repository', async () => {
		const payload = { citation: 'Update', auteur_id: null };
		const updated = await citationService.updateCitation(5, payload);
		expect(citationRepo.update).toHaveBeenCalledWith(5, payload);
		expect(updated).toMatchObject({ id: 5, ...payload });
	});

	it('deleteCitation appelle remove', async () => {
		await citationService.deleteCitation(9);
		expect(citationRepo.remove).toHaveBeenCalledWith(9);
	});
});
