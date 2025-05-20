export const successResponse = (res, { statusCode = 200, message, data = null }) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

export const errorResponse = (res, { statusCode = 500, message, error = null }) => {
    return res.status(statusCode).json({
        success: false,
        message,
        error: error?.message || error
    });
};

export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}; 