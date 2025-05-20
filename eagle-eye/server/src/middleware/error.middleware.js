import { errorResponse, HTTP_STATUS } from '../utils/response.utils.js';

export class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return errorResponse(res, {
            statusCode: err.statusCode,
            message: err.message,
            error: err
        });
    }

    // Production mode
    if (err.isOperational) {
        return errorResponse(res, {
            statusCode: err.statusCode,
            message: err.message
        });
    }

    // Programming or unknown errors
    console.error('ERROR 💥', err);
    return errorResponse(res, {
        statusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
        message: 'Something went wrong!'
    });
};

export const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
}; 