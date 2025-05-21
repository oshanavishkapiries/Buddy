import { createUser, getUserByEmail, getUserById } from '../service/user.service.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppError, catchAsync } from '../middleware/error.middleware.js';
import { successResponse, errorResponse, HTTP_STATUS } from '../utils/response.utils.js';

// Create new user
export const register = catchAsync(async (req, res) => {
    const { email, password, reset_password_Q, reset_password_A } = req.body;

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
        throw new AppError('User already exists', HTTP_STATUS.BAD_REQUEST);
    }

    // Create new user
    const user = await createUser({
        email,
        password,
        reset_password_Q,
        reset_password_A
    });

    return successResponse(res, {
        statusCode: HTTP_STATUS.CREATED,
        message: 'User created successfully',
        data: {
            id: user._id,
            email: user.email
        }
    });
});

// Login user
export const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;

    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
        throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new AppError('Invalid credentials', HTTP_STATUS.UNAUTHORIZED);
    }

    // Generate JWT token
    const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return successResponse(res, {
        message: 'Login successful',
        data: {
            token,
            user: {
                id: user._id,
                email: user.email
            }
        }
    });
});

// Get user profile
export const getProfile = catchAsync(async (req, res) => {
    const user = await getUserById(req.user.userId);
    if (!user) {
        throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    return successResponse(res, {
        data: {
            id: user._id,
            email: user.email
        }
    });
});

// Update user profile
export const updateProfile = catchAsync(async (req, res) => {
    const { email, reset_password_Q, reset_password_A } = req.body;

    const user = await getUserById(req.user.userId);

    if (!user) {
        throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    // Update fields
    if (email) user.email = email;
    if (reset_password_Q) user.reset_password_Q = reset_password_Q;
    if (reset_password_A) user.reset_password_A = reset_password_A;

    await user.save();

    return successResponse(res, {
        message: 'Profile updated successfully',
        data: {
            id: user._id,
            email: user.email
        }
    });
});

// Change password
export const changePassword = catchAsync(async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const user = await getUserById(req.user.userId);

    if (!user) {
        throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new AppError('Current password is incorrect', HTTP_STATUS.UNAUTHORIZED);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    return successResponse(res, {
        message: 'Password changed successfully'
    });
});

// Reset password
export const resetPassword = catchAsync(async (req, res) => {
    const { email, reset_password_Q, reset_password_A, newPassword } = req.body;

    const user = await getUserByEmail(email);

    console.table(user);

    if (!user) {
        throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
    }

    if (reset_password_Q !== user.reset_password_Q) {
        throw new AppError('Reset password question is incorrect', HTTP_STATUS.UNAUTHORIZED);
    }

    if (reset_password_A !== user.reset_password_A) {
        throw new AppError('Reset password answer is incorrect', HTTP_STATUS.UNAUTHORIZED);
    }

    user.password = newPassword;
    await user.save();

    return successResponse(res, {
        message: 'Password reset successfully'
    });
});

