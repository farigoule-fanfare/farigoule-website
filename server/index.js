const express = require('express');
const compression = require('compression');
const cors = require('cors'); // Import CORS middleware
const cookieParser = require('cookie-parser'); // Added cookie-parser
const path = require('path'); // Import path module
const routes = require('./routes/routes');
const authRoutes = require('./routes/authRoutes'); // Import auth routes
const userRoutes = require('./routes/userRoutes'); // Import user routes
const fanfaronsRoutes = require('./routes/admin/fanfarons');
const contratsRoutes = require('./routes/admin/contrats');
const diaposRoutes = require('./routes/admin/diapos');
const citationsRoutes = require('./routes/admin/citations');
const adminRoutes = require('./routes/admin/manageUsers');


const db = require('./database'); // Ensure DB is initialized when server starts

const app = express();
const PORT = process.env.PORT || 5000; // Use environment variable for port or default to 5000

// --- Middleware --- 

// Configure CORS to allow specific origin and credentials
// const corsOptions = {
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000', // Your React app's origin
//     credentials: true, // Allow cookies and authorization headers
//     optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
// };
// app.use(cors(corsOptions));

// TODO configure to work on CORS package
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", process.env.FRONTEND_URL || 'http://localhost:3000');
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

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
// All API routes are prefixed with /route as per this setup
app.use("/route/", routes);
app.use("/route/auth", authRoutes); // Mount auth routes
app.use("/route/users", userRoutes); // Mount user routes at /api/users
app.use('/route/admin/fanfarons', fanfaronsRoutes);
app.use('/route/admin/contrats', contratsRoutes);
app.use('/route/admin/diapos', diaposRoutes);
app.use('/route/admin/citations', citationsRoutes);
app.use('/route/admin/manageUsers', /* isAdminMiddleware, */ adminRoutes);

// --- Catch-all for server status (optional) ---
// This should be after your specific API routes
app.use("/", (req, res) => {
    res.send("Farigoule Vercel Server is running");
});

// --- Start Server ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    if (db && db.filename) { // Check if db object and filename property exist
        console.log(`Connected to SQLite database at: ${db.filename}`);
    } else {
        console.log("SQLite database object not fully initialized or filename not available at server start.");
    }
});