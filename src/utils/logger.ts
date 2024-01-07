import winston, {format} from 'winston';

const {combine, timestamp, printf} = format;

const myFormat = printf(({level, message, timestamp}) => {
    return `${timestamp} ${level}: ${message}`;
});

const transports = [];
if (process.env.NODE_ENV === 'development') {
    transports.push(new winston.transports.File({filename: 'logs/combined.log'}));
} else {
    transports.push(new winston.transports.Console());
}

const logger = winston.createLogger({
    transports,
    format: combine(
        timestamp(),
        myFormat
    )
});

export default logger;
