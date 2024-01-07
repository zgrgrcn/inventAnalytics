"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.errorConverter = void 0;
const typeorm_1 = require("typeorm");
const http_status_1 = __importDefault(require("http-status"));
const logger_1 = __importDefault(require("../utils/logger"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof apiError_1.default)) {
        const statusCode = error.statusCode || error instanceof typeorm_1.TypeORMError ? http_status_1.default.BAD_REQUEST : http_status_1.default.INTERNAL_SERVER_ERROR;
        const message = error.message || http_status_1.default[statusCode];
        error = new apiError_1.default(statusCode, message, false, err.stack);
    }
    next(error);
};
exports.errorConverter = errorConverter;
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (process.env.ENV === 'production' && !err.isOperational) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message = http_status_1.default[http_status_1.default.INTERNAL_SERVER_ERROR];
    }
    res.locals.errorMessage = err.message;
    const response = Object.assign({ code: statusCode, message }, (process.env.ENV === 'development' && { stack: err.stack }));
    if (process.env.ENV === 'development') {
        logger_1.default.error(err);
    }
    logger_1.default.error('returning error response: ', response);
    res.status(statusCode).send(response);
};
exports.errorHandler = errorHandler;
