import { createCookie, getCookie } from '../service/cookie.service.js';
import { AppError, catchAsync } from '../middleware/error.middleware.js';
import { successResponse, errorResponse, HTTP_STATUS } from '../utils/response.utils.js';

export const createCookieController = catchAsync(async (req, res) => {
    const { provider, cookies } = req.body;
    const userId = req.user.id;
    const cookie = await createCookie(userId, provider, cookies);
    successResponse(res, cookie, HTTP_STATUS.CREATED);
});

export const getCookieController = catchAsync(async (req, res) => {
    const { provider } = req.body;
    const userId = req.user.id;
    const cookie = await getCookie(userId, provider);
    successResponse(res, cookie, HTTP_STATUS.OK);
});

