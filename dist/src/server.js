"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const data_source_1 = require("./data-source");
const logger_1 = __importDefault(require("./utils/logger"));
const port = process.env.PORT || 3000;
let server;
const connect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, data_source_1.initializeDataSource)();
        server = app_1.default.listen(port, () => {
            logger_1.default.info(`http://localhost:${port}`);
        });
    }
    catch (e) {
        if (e instanceof Error) {
            logger_1.default.error(`The connection to database was failed with error: ${e.message}`);
        }
        else {
            logger_1.default.error(`connection error: ${e}`);
        }
    }
});
connect();
const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger_1.default.info('Server closed');
            process.exit(1);
        });
    }
    else {
        process.exit(1);
    }
};
const unexpectedErrorHandler = (error) => {
    logger_1.default.error(error);
    exitHandler();
};
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
    logger_1.default.info('SIGTERM signal received.');
    server.close(() => {
        logger_1.default.info('Http server closed.');
    });
});
