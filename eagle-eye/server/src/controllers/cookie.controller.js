import { createCookie, getCookie } from '../service/cookie.service.js';
import { AppError, catchAsync } from '../middleware/error.middleware.js';
import { successResponse, errorResponse, HTTP_STATUS } from '../utils/response.utils.js';

export const createCookieController = catchAsync(async (req, res) => {
    const { provider, cookies } = req.body;
    
    if (!req.user || !req.user.userId) {
        throw new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!provider || !cookies) {
        throw new AppError('Provider and cookies are required', HTTP_STATUS.BAD_REQUEST);
    }

    const userId = req.user.userId;
    const cookie = await createCookie(userId, provider, cookies);
    successResponse(res, cookie, HTTP_STATUS.CREATED);
});

export const getCookieController = catchAsync(async (req, res) => {
    const { provider } = req.body;

    if (!req.user || !req.user.userId) {
        throw new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!provider) {
        throw new AppError('Provider is required', HTTP_STATUS.BAD_REQUEST);
    }

    const userId = req.user.userId;
    const cookie = await getCookie(userId, provider);

    if (!cookie) {
        throw new AppError('Cookie not found', HTTP_STATUS.NOT_FOUND);
    }

    successResponse(res, {
        statusCode: HTTP_STATUS.OK,
        message: 'Cookie fetched successfully',
        data: cookie
    });
});

