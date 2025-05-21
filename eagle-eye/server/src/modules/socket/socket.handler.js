class SocketHandler {
    constructor(io) {
        this.io = io;
        this.connectedUsers = new Map();
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`[SERVER] Client connected ✅ with ID: ${socket.id}`);

            socket.on('disconnect', () => {
                console.log(`[SERVER] Client disconnected ❌ with ID: ${socket.id}`);
            });
        });
    }
}

export default SocketHandler; 