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
const logger_1 = __importDefault(require("../utils/logger"));
const user_service_1 = __importDefault(require("../services/user.service"));
class UsersController {
    static getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield user_service_1.default.getAll();
                logger_1.default.info(`Users count: ${data.length}`);
                res.send(data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield user_service_1.default.create(req.body);
                logger_1.default.info(`User created with ID: ${user.id}`);
                res.status(201).send();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    id: parseInt(req.params.userId),
                };
                const data = yield user_service_1.default.getOne(params);
                logger_1.default.info(`get User: ${JSON.stringify(data)}`);
                res.send(data);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    id: parseInt(req.params.userId),
                };
                const data = yield user_service_1.default.deleteOne(params);
                logger_1.default.info(`delete User: ${data}`);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static borrowBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    userId: parseInt(req.params.userId),
                    bookId: parseInt(req.params.bookId),
                };
                logger_1.default.info(`borrowBook: ${JSON.stringify(params)}`);
                yield user_service_1.default.borrowBook(params);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static returnBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    userId: parseInt(req.params.userId),
                    bookId: parseInt(req.params.bookId),
                };
                const score = req.body.score;
                yield user_service_1.default.returnBook(params, score);
                logger_1.default.info(`return Book: ${JSON.stringify(params)}`);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = UsersController;
