import {TypeORMError} from 'typeorm';
import httpStatus from 'http-status';
import logger from '../utils/logger';
import ApiError from '../utils/apiError';

const errorConverter = (err: any, req: any, res: any, next: any) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || error instanceof TypeORMError ? httpStatus.BAD_REQUEST : httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

const errorHandler = (err: any, req: any, res: any, next: any) => {
    let {statusCode, message} = err;
    if (process.env.ENV === 'production' && !err.isOperational) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = httpStatus[httpStatus.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(process.env.ENV === 'development' && {stack: err.stack}),
    };

    if (process.env.ENV === 'development') {
        logger.error(err);
    }

    logger.error('returning error response: ', response);
    res.status(statusCode).send(response);
};

export {
    errorConverter,
    errorHandler,
};
