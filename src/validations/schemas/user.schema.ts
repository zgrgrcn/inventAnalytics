import joi from 'joi';

export default {
    create: {
        body: {
            name: joi.string().min(1).max(100).required(),
        },
    },
    getAll: {
        query: {
            limit: joi.number().min(1).max(100),
            skip: joi.number().min(0),
        },
    },
    getOne: {
        params: {
            userId: joi.number().required(),
        },
    },
    deleteOne: {
        params: {
            userId: joi.number().required(),
        },
    },
    borrowBook: {
        params: {
            userId: joi.number().required(),
            bookId: joi.number().required(),
        },
    },
    returnBook: {
        params: {
            userId: joi.number().required(),
            bookId: joi.number().required(),
        },
        body: {
            score: joi.number().min(0).max(10).required(),
        },
    },
};