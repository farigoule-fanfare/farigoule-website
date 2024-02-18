const sqlite3 = require('sqlite3');

const test = async () => {
    let errorReason
    try {
        // DO SOMETHING
        console.log("test")
        // const d = await testSqlite()

        console.log("d", d)

        return { success: true, data: { success: true } }
    }
    catch (e) {
        return ({ success: false, errorReason: errorReason, error: e })
    }
}

const testSqlite = async (
    request,
    response,
) => {
    try {
        const db = new sqlite3.Database('database/mydatabase.db');

        db.serialize(() => {
            db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)');

            const stmt = db.prepare('INSERT INTO users (name) VALUES (?)');
            stmt.run('John Doe');
            stmt.run('Jane Smith');
            stmt.finalize();

            db.each('SELECT * FROM users', (err, row) => {
                console.log(row);
            });
        });

        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed.');
            }
        });

        return response.status(200).json({ result });
    } catch (error) {
        return response.status(500).json({ error });
    }
}


module.exports = {
    test
}