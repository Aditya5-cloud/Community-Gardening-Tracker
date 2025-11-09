const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const gardenRoutes = require('./routes/gardens');
const plantRoutes = require('./routes/plants');
const taskRoutes = require('./routes/tasks');
const eventRoutes = require('./routes/events');
const chatRoutes = require('./routes/chat');
const activityRoutes = require('./routes/activity'); // Import activity routes

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for Socket.io
    methods: ['GET', 'POST'],
  },
});

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));
app.use(cors()); // Enable CORS for all routes

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/gardens', gardenRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/tasks', taskRoutes); // <-- FIX: Was 'app.MimeType' before
app.use('/api/events', eventRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/activity', activityRoutes); // Use activity routes

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('joinGarden', (gardenId) => {
    socket.join(gardenId);
    console.log(`User joined garden room: ${gardenId}`);
  });

  socket.on('sendMessage', (message) => {
    // Save message to DB (handled by chat routes)
    // Emit message to all in garden room
    io.to(message.garden).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Serve static assets in production (for uploads)
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the frontend build directory
  app.use(express.static(path.join(__dirname, '../frontend/build')));

  // For any other route, serve the frontend's index.html
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/build', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

module.exports = app;