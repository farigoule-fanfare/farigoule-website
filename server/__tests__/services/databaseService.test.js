jest.mock('better-sqlite3', () => {
	const mockDbInstance = {
		exec: jest.fn(),
		close: jest.fn(),
		prepare: jest.fn(),
	};
	const MockDatabase = jest.fn(() => mockDbInstance);
	MockDatabase.__instance = mockDbInstance;
	return MockDatabase;
});

describe('databaseService', () => {
	it('initialise la base SQLite avec le bon chemin et timeout', () => {
		const MockDatabase = require('better-sqlite3');
		const db = require('../../services/databaseService');
		expect(MockDatabase).toHaveBeenCalledTimes(1);
		const [dbPath, options] = MockDatabase.mock.calls[0];
		expect(dbPath).toContain('farigoule.sqlite');
		expect(options).toEqual({ timeout: 3000 });
		expect(typeof db.prepare).toBe('function');
	});
});
