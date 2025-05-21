import mongoose from 'mongoose';

const cookieSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    provider: {
        type: String,
        required: true,
        trim: true
    },
    cookies: {
        type: Array,
        required: true,
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true // This will automatically update the updatedAt field
});

// Create compound index on user and provider for faster queries
cookieSchema.index({ user: 1, provider: 1 }, { unique: true });

const Cookie = mongoose.model('Cookie', cookieSchema);

export default Cookie;



