const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the path for the database file
// It will be created in the 'server/database/' directory
const DB_PATH = path.resolve(__dirname, '..', 'database', 'farigoule.sqlite');

// Create or open the database
// The OPEN_READWRITE flag means the database is opened for reading and writing.
// The OPEN_CREATE flag means the database is created if it does not already exist.
const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log('Connected to the SQLite database at', DB_PATH);
        // We can initialize tables here if needed, or call a separate init function
        initializeDb();
    }
});

// Function to initialize database tables
function initializeDb() {
    db.serialize(() => {
        // Create fanfarons table
        // TODO: Finalize columns - consider adding email, password_hash, roles for authentication
        db.run(`CREATE TABLE IF NOT EXISTS fanfarons (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            surnom TEXT UNIQUE NOT NULL,
            prenom TEXT,                    -- From original schema, will be NULL if not in JSON
            nom TEXT,                       -- From original schema, will be NULL if not in JSON
            instrument TEXT,                -- From JSON export
            promo INTEGER,                  -- From JSON export (ensure it's INTEGER)
            bureau TEXT,                    -- From JSON export (e.g., 'president', 'tresorier', 'membre', 'biere')
            tel TEXT,                       -- From JSON export
            email TEXT UNIQUE,              -- Mapped from 'mail' in JSON, or new for auth
            photo TEXT,                     -- From JSON export (filename)
            description TEXT,               -- From JSON export
            password_hash TEXT,             -- For new auth system
            roles TEXT DEFAULT 'fanfaron'   -- For new auth system (e.g., 'fanfaron,admin')
        )`, (err) => {
            if (err) {
                console.error("Error creating/altering fanfarons table:", err.message);
            }
        });

        // Create citations table
        db.run(`CREATE TABLE IF NOT EXISTS citations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            citation TEXT NOT NULL,
            auteur_id INTEGER,
            FOREIGN KEY (auteur_id) REFERENCES fanfarons (id) ON DELETE SET NULL -- Keep citation if fanfaron deleted
        )`, (err) => {
            if (err) {
                console.error("Error creating citations table:", err.message);
            }
        });

        // Create diapos table for carousel images
        db.run(`CREATE TABLE IF NOT EXISTS diapos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            fichier TEXT NOT NULL,         -- Filename of the image
            description TEXT,              -- Caption for the image
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP -- To sort by latest if needed
        )`, (err) => {
            if (err) {
                console.error("Error creating diapos table:", err.message);
            }
        });

        // Create contrats table for dates/events
        db.run(`CREATE TABLE IF NOT EXISTS contrats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date DATE NOT NULL,                -- Store as YYYY-MM-DD
            lieu TEXT,                     -- Location of the event
            description TEXT,              -- Optional details about the event
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error("Error creating contrats table:", err.message);
            }
        });

        // TODO: Add other tables as needed (e.g., for chat messages, page content, etc.)

        console.log("Database tables checked/initialized.");
    });
}

// Export the database connection
module.exports = db; 