import { createCookie, getCookie, updateCookie, deleteCookie, getCookiesProvider } from '../service/cookie.service.js';
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

export const updateCookieController = catchAsync(async (req, res) => {
    const { provider, cookies } = req.body;

    if (!req.user || !req.user.userId) {
        throw new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!provider || !cookies) {
        throw new AppError('Provider and cookies are required', HTTP_STATUS.BAD_REQUEST);
    }

    const userId = req.user.userId;
    const cookie = await updateCookie(userId, provider, cookies);
    successResponse(res, cookie, HTTP_STATUS.OK);
});

export const getCookieController = catchAsync(async (req, res) => {
    const { provider } = req.query;

    if (!req.user || !req.user.userId) {
        throw new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!provider) {
        throw new AppError('Provider is required', HTTP_STATUS.BAD_REQUEST);
    }

    const userId = req.user.userId;
    const cookie = await getCookie(userId, provider);

    successResponse(res, {
        statusCode: HTTP_STATUS.OK,
        message: 'Cookie fetched successfully',
        data: cookie || []
    });
});

export const deleteCookieController = catchAsync(async (req, res) => {
    const { provider } = req.query;

    if (!req.user || !req.user.userId) {
        throw new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED);
    }

    if (!provider) {
        throw new AppError('Provider is required', HTTP_STATUS.BAD_REQUEST);
    }

    const userId = req.user.userId;
    const cookie = await deleteCookie(userId, provider);
    successResponse(res, cookie, HTTP_STATUS.OK);
});

export const getCookiesProviderController = catchAsync(async (req, res) => {
    const userId = req.user.userId;
    const cookies = await getCookiesProvider(userId);
    successResponse(res, {
        statusCode: HTTP_STATUS.OK,
        message: 'Cookies provider fetched successfully',
        data: cookies
    });
});

