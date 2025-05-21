import { getSystemInfo } from './emits/system-info.js';

class SocketHandler {
    constructor(io) {
        this.io = io;
        this.connectedUsers = new Map();
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`[SERVER] Client connected ✅ with ID: ${socket.id}`);

            // Start sending system info to the connected client
            getSystemInfo(socket);

            socket.on('disconnect', () => {
                console.log(`[SERVER] Client disconnected ❌ with ID: ${socket.id}`);
            });
        });
    }
}

export default SocketHandler; 