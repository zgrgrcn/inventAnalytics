import 'dotenv/config';
import app from './app';
import {initializeDataSource} from "./data-source";
import logger from './utils/logger';
import http from 'http';

const port = process.env.PORT || 3000;
let server: http.Server;

const connect = async () => {
    try {
        await initializeDataSource();
        server = app.listen(port, () => {
            logger.info(`http://localhost:${port}`);
        });
    } catch (e) {
        if (e instanceof Error) {
            logger.error(`The connection to database was failed with error: ${e.message}`);
        } else {
            logger.error(`connection error: ${e}`);
        }
    }
}

connect();


const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error: any) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
process.on('SIGTERM', () => {
    logger.info('SIGTERM signal received.')
    server.close(() => {
        logger.info('Http server closed.')
    })
})
