const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('express-mongo-sanitize');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const { apiLimiter, loginLimiter, passwordResetLimiter } = require('./middleware/rateLimiter');
const logger = require('./utils/logger');
const gracefulShutdown = require('./utils/gracefulShutdown');
const deepHealth = require('./utils/deepHealth');
const swaggerSetup = require('./config/swagger');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: process.env.CLIENT_URL || 'http://localhost:5173', methods: ['GET', 'POST', 'PUT', 'DELETE'] } });

// Make io accessible in routes
app.set('io', io);

// ─── Security Middleware ───
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(mongoSanitize());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(apiLimiter);

// ─── Logging ───
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}
app.use(morgan('combined', { stream: logger.stream }));

// ─── Body Parsing ───
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', deepHealth);

// Swagger API docs (development only)
if (process.env.NODE_ENV !== 'production') {
  swaggerSetup(app);
}

// ─── Routes ───
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/schools', require('./routes/schoolRoutes'));
app.use('/api/classes', require('./routes/classRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));
app.use('/api/fees', require('./routes/feeRoutes'));
app.use('/api/homework', require('./routes/homeworkRoutes'));
app.use('/api/exams', require('./routes/examRoutes'));
app.use('/api/timetable', require('./routes/timetableRoutes'));
app.use('/api/materials', require('./routes/materialRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/salaries', require('./routes/salaryRoutes'));
app.use('/api/transport', require('./routes/transportRoutes'));
app.use('/api/admissions', require('./routes/admissionRoutes'));
app.use('/api/leaves', require('./routes/leaveRoutes'));
app.use('/api/stock', require('./routes/stockRoutes'));
app.use('/api/misc', require('./routes/miscRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/extended', require('./routes/extendedRoutes'));
app.use('/api/sections', require('./routes/classRoutes'));
app.use('/api/activity', require('./routes/activityRoutes'));
app.use('/api/download', require('./routes/downloadRoutes'));
app.use('/api/documents', require('./routes/documentRoutes'));
app.use('/api/fees-extended', require('./routes/feeExtendedRoutes'));
app.use('/api/exams-extended', require('./routes/examExtendedRoutes'));
app.use('/api/features', require('./routes/featureRoutes'));
app.use('/api/library', require('./routes/libraryRoutes'));
app.use('/api/campus', require('./routes/campusRoutes'));
app.use('/api/org', require('./routes/orgRoutes'));
app.use('/api/misc-ext', require('./routes/miscExtRoutes'));

// Socket.io connection
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);
  socket.on('joinRoom', (chatRoom) => { socket.join(chatRoom); });
  socket.on('leaveRoom', (chatRoom) => { socket.leave(chatRoom); });
  socket.on('disconnect', () => { logger.info(`Socket disconnected: ${socket.id}`); });
});

// ─── Error Handling ───
app.use((err, req, res, next) => {
  logger.error(`${err.statusCode || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

const PORT = process.env.PORT || 5000;
const serverInstance = server.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

gracefulShutdown(serverInstance);

module.exports = app;
