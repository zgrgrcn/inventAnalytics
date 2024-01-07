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
            bookId: joi.number().required(),
        },
    },
    deleteOne: {
        params: {
            bookId: joi.number().required(),
        },
    },
};