import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import prisma from './lib/prisma.js';

// Load env variables
dotenv.config();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Setup app and server
const app = express();
const server = http.createServer(app);

// Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Middlewares
app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(morgan('dev'));

// Rate limiter (apply only in production or to specific routes)
if (process.env.NODE_ENV === 'production') {
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  });
  app.use('/api/', apiLimiter);
}

// Routes
import courseRoutes from './routes/courseRoutes.js';
import userRoutes from './routes/userRoutes.js';
import quizRoutes from './routes/quizRoutes.js';
import completionRoutes from './routes/completionRoutes.js';
import enrollmentRoutes from './routes/enrollmentRoutes.js';

app.use('/api/courses', courseRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/completions', completionRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// Simple health check endpoint
app.get('/ping', (req, res) => res.send('pong'));

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}`);

  socket.on('courseUpdate', (course) => socket.broadcast.emit('courseUpdate', course));
  socket.on('courseDelete', (courseId) => socket.broadcast.emit('courseDelete', courseId));
  socket.on('quizUpdate', (quiz) => socket.broadcast.emit('quizUpdate', quiz));
  socket.on('quizDelete', (quizId) => socket.broadcast.emit('quizDelete', quizId));
  socket.on('progressUpdate', (completion) => socket.broadcast.emit('progressUpdate', completion));

  socket.on('disconnect', () => {
    console.log(`🔴 Socket disconnected: ${socket.id}`);
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  app.use(express.static(join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
  });
}

// Connect to database and start server
async function startServer() {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Connected to PostgreSQL database');
    
    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    process.exit(1); // Exit to avoid half-broken server
  }
}

startServer();

// Export for testing if needed
export { io };