import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import pkg from 'pg';

const { Pool } = pkg;

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins (adjust as needed)
    methods: ['GET', 'POST'],
  },
});

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'vyral',
  password: 'yourpassword',
  port: 5432,
});

const PORT = 5000;

app.use(express.json());

const connectedUsers = new Map();

// Handle WebSocket Connection
io.on('connection', (socket) => {
  console.log('User connected');

  // Authenticate User
  socket.on('authenticate', async ({ userId }) => {
    if (!userId) return;
    connectedUsers.set(userId, socket);
    console.log(`User ${userId} connected`);

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
      console.log(`User ${userId} disconnected`);
    });
  });

  // Handle Direct Messages
  socket.on('sendMessage', async ({ senderId, receiverCompanyId, content }) => {
    if (!senderId || !receiverCompanyId || !content) return;

    try {
      const result = await pool.query(
        `INSERT INTO user_messages (sender_id, receiver_company_id, content)
         VALUES ($1, $2, $3) RETURNING *`,
        [senderId, receiverCompanyId, content]
      );

      const message = result.rows[0];

      // Emit to receiver if online
      if (connectedUsers.has(receiverCompanyId)) {
        connectedUsers.get(receiverCompanyId).emit('receiveMessage', message);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    }
  });

  // Handle Broadcast Messages
  socket.on('broadcastMessage', async ({ senderId, companyId, content }) => {
    try {
      const result = await pool.query(
        `INSERT INTO user_messages (sender_id, receiver_company_id, content)
         VALUES ($1, $2, $3) RETURNING *`,
        [senderId, companyId, content]
      );

      const message = result.rows[0];

      // Emit to all members of that company
      io.to(`company-${companyId}`).emit('receiveMessage', message);
    } catch (err) {
      console.error('Error broadcasting message:', err);
    }
  });

  // Join Broadcast Channel
  socket.on('joinCompanyChannel', ({ userId, companyId }) => {
    socket.join(`company-${companyId}`);
    console.log(`User ${userId} joined channel for company ${companyId}`);
  });
});

// API to Fetch Messages
app.get('/api/messages/:receiverCompanyId', async (req, res) => {
  const { receiverCompanyId } = req.params;
  const { senderId } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM user_messages
       WHERE (sender_id = $1 AND receiver_company_id = $2)
          OR (sender_id = $2 AND receiver_company_id = $1)
       ORDER BY created_at ASC`,
      [senderId, receiverCompanyId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching messages:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start Server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
