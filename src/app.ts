import "reflect-metadata";
import express from 'express';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerDocument from './docs/swagger';
import actuator from 'express-actuator';
import limiter from './middlewares/rateLimiter';
import {errorConverter, errorHandler} from './middlewares/error';
import indexRouter from './routes/index.routes';
import ApiError from './utils/apiError';
import httpStatus from 'http-status';
import helmet from "helmet";

const swaggerSpec = swaggerJSDoc(swaggerDocument);

const app = express()

app.use(helmet());

app.use(express.json({limit: '10kb'}));

app.use(actuator())

app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(limiter);

app.use('/', indexRouter);

app.use((req, res, next) => {
    next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);
app.use(errorHandler);

export default app;
