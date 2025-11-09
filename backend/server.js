const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5001;

// CORS configuration
const frontendURL = process.env.FRONTEND_URL;
if (!frontendURL) {
  console.error("Error: FRONTEND_URL environment variable is not set.");
  // You might want to exit or use a default, but for now, we'll just log
}

const corsOptions = {
  origin: [frontendURL, "http://localhost:3000"], // Allow both production and local dev
  credentials: true, // Allow cookies
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// MongoDB Connection
const mongoURI = process.env.MONGODB_URI;
if (!mongoURI) {
  console.error("Error: MONGODB_URI environment variable is not set.");
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected successfully"))
.catch(err => console.error("MongoDB connection error:", err));

// --- API Routes ---
// We prefix all API routes with '/api' for consistency

const authRoutes = require('./routes/auth');
const gardenRoutes = require('./routes/gardens');
const plantRoutes = require('./routes/plants');
const taskRoutes = require('./routes/tasks');
const eventRoutes = require('./routes/events');
const chatRoutes = require('./routes/chat');
const usersRoutes = require('./routes/users');
const activityRoutes = require('./routes/activity');

// *** THIS IS THE FIX ***
// All auth routes will now be under '/api/auth'
app.use('/api/auth', authRoutes); 

// Other routes
app.use('/api/gardens', gardenRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/activity', activityRoutes);

// Simple test route for the root
app.get('/', (req, res) => {
  res.send('Community Garden Tracker API is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});