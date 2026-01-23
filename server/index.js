const express = require('express');
const compression = require('compression');
const cors = require('cors'); // Import CORS middleware
const cookieParser = require('cookie-parser'); // Added cookie-parser
const path = require('path'); // Import path module
const api = require('./routes');
const sitemapRoutes = require('./routes/sitemapRoutes');


const db = require('./services/databaseService'); // Ensure DB is initialized when server starts

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for port or default to 5000

app.use(require('morgan')('combined'));

const FRONT_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const corsOptions = {
  origin: FRONT_URL,
  credentials: true,
  methods: ['GET', 'PATCH', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  optionsSuccessStatus: 200,  // réponse aux pré-vol
};
app.use(cors(corsOptions));

// Parse cookies
app.use(cookieParser()); // Added cookie-parser middleware

// Compress responses
app.use(compression());

// Enable bodyParser (for JSON and URL-encoded data)
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// --- Static File Serving --- 
// Serve files from the server/public directory at the /public URL path
app.use('/public', express.static(path.join(__dirname, 'public')));

// --- Routes ---
// All API routes are prefixed with /api
app.use('/api', api);
// Public sitemap route
app.use('/', sitemapRoutes);

// --- Catch-all for server status (optional) ---
// This should be after your specific API routes
app.use("/", (_req, res) => {
    res.send("Farigoule Vercel Server is running");
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (db && db.name) { // Check if db object and filename property exist
        console.log(`Connected to SQLite database at: ${db.name}`);
    } else {
        console.log("SQLite database object not fully initialized or filename not available at server start.");
    }
});