const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');
const boardRoutes = require('./routes/boardRoutes');
// const setupSocketHandlers = require('./sockets/socketHandlers');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/game', gameRoutes);
app.use('/api/users', userRoutes);
app.use('/api/board', boardRoutes);

// Get access to the games Map
const games = gameRoutes.games;

// Set up basic Socket.IO event handler
io.on('connection', (socket) => {
  console.log('A client has connected:', socket.id);

  // Log when the server receives a connection attempt
  console.log('Connection attempt received');

  socket.on('connect', () => {
    console.log('Client connected:', socket.id);
  });

  // Handle chat messages
  socket.on('message', (message) => {
    console.log('Received message:', message);
    // Broadcast the message to all connected clients
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('A client has disconnected:', socket.id);
  });

  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});
const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});