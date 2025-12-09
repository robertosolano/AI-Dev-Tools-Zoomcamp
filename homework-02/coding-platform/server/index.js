const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());


const roomMetadata = {}; // Stores { roomId: { creator: 'Name', participants: 0 } }

// Serve static files from the public directory (React build) only in production
const path = require('path');

app.get('/api/rooms', (req, res) => {
  res.json(roomMetadata);
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));

  // Handle SPA routing: return index.html for any unknown route
  app.get(/(.*)/, (req, res) => {
    // Skip API routes
    if (req.path.startsWith('/api')) return res.status(404).send('Not Found');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
} else {
  // In development, just basic message or 404
  app.get('/', (req, res) => {
    res.send(`Server is running in ${process.env.NODE_ENV || 'development'} mode. For frontend, use the Vite dev server.`);
  });
}

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for MVP simplicity
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);

    // Update participant count if room exists
    if (roomMetadata[roomId]) {
      roomMetadata[roomId].participants = (io.sockets.adapter.rooms.get(roomId) || new Set()).size;
    }
  });

  socket.on('register-room', ({ roomId, creator }) => {
    roomMetadata[roomId] = {
      creator,
      participants: 1, // Initial creator
      createdAt: new Date()
    };
    console.log(`Room registered: ${roomId} by ${creator}`);
  });

  socket.on('code-change', ({ roomId, code }) => {
    socket.to(roomId).emit('code-update', code);
  });

  socket.on('language-change', ({ roomId, language }) => {
    socket.to(roomId).emit('language-update', language);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Cleanup empty rooms?
    // We can loop through roomMetadata and check existing io rooms
    // Or just lazily let them stay for now, or use a cleanup interval.
    // Ideally we remove if size is 0.

    setTimeout(() => {
      // Simple cleanup
      const adapterRooms = io.sockets.adapter.rooms;
      Object.keys(roomMetadata).forEach(roomId => {
        if (!adapterRooms.has(roomId)) {
          delete roomMetadata[roomId];
          console.log(`Room ${roomId} deleted (empty)`);
        } else {
          roomMetadata[roomId].participants = adapterRooms.get(roomId).size;
        }
      });
    }, 1000);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`Static files path: ${path.join(__dirname, 'public')}`);
});
