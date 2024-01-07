import rateLimiter from 'express-rate-limit';

const limiter = rateLimiter({
    windowMs: 15 * 60 * 1000,
    limit: 100
});

export default limiter;
