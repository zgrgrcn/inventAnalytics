"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.default = {
    create: {
        body: {
            name: joi_1.default.string().min(1).max(100).required(),
        },
    },
    getAll: {
        query: {
            limit: joi_1.default.number().min(1).max(100),
            skip: joi_1.default.number().min(0),
        },
    },
    getOne: {
        params: {
            userId: joi_1.default.number().required(),
        },
    },
    deleteOne: {
        params: {
            userId: joi_1.default.number().required(),
        },
    },
    borrowBook: {
        params: {
            userId: joi_1.default.number().required(),
            bookId: joi_1.default.number().required(),
        },
    },
    returnBook: {
        params: {
            userId: joi_1.default.number().required(),
            bookId: joi_1.default.number().required(),
        },
        body: {
            score: joi_1.default.number().min(0).max(10).required(),
        },
    },
};
