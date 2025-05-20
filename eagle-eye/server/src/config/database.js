import mongoose from 'mongoose';

class Database {
    constructor() {
        this.connection = null;
    }

    async connect() {
        try {
            if (this.connection) {
                return this.connection;
            }

            const mongoURI = process.env.MONGODB_URI;
            if (!mongoURI) {
                throw new Error('MONGODB_URI is not defined in environment variables');
            }

            this.connection = await mongoose.connect(mongoURI, {
                serverSelectionTimeoutMS: 5000,
                socketTimeoutMS: 45000,
            });

            console.log('MongoDB connected successfully');
            return this.connection;
        } catch (error) {
            console.error('MongoDB connection error:', error);
            throw error;
        }
    }

    async disconnect() {
        try {
            if (this.connection) {
                await mongoose.disconnect();
                this.connection = null;
                console.log('MongoDB disconnected successfully');
            }
        } catch (error) {
            console.error('MongoDB disconnection error:', error);
            throw error;
        }
    }

    getConnection() {
        return this.connection;
    }
}

const database = new Database();

export default database; 