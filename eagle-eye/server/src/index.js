import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import database from './config/database.js';
import { configureSocket } from './config/socket.config.js';
import SocketHandler from './modules/socket/socket.handler.js';
import { errorHandler } from './middleware/error.middleware.js';
import { successResponse } from './utils/response.utils.js';

import { userRouter } from './routes/user.routes.js';
import { cookieRouter } from './routes/cookie.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRouter);
app.use('/api/cookies', cookieRouter);

// Health check endpoint
app.get('/health', (req, res) => {
    return successResponse(res, {
        message: 'Server is running'
    });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const server = app.listen(PORT, async () => {
    await database.connect();
    console.log(`Server is running on port ${PORT}`);
});

// Initialize Socket.IO
const io = configureSocket(server);
new SocketHandler(io);

// Graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM signal received: closing HTTP server');
    await database.disconnect();
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    console.log('SIGINT signal received: closing HTTP server');
    await database.disconnect();
    server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
    });
}); 