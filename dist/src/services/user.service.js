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
const book_entity_1 = require("../entity/book.entity");
const user_entity_1 = require("../entity/user.entity");
const logger_1 = __importDefault(require("../utils/logger"));
const userBook_entity_1 = require("../entity/userBook.entity");
const http_status_1 = __importDefault(require("http-status"));
const apiError_1 = __importDefault(require("../utils/apiError"));
class UserService {
    static getOne(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbUser = yield user_entity_1.User.findOne({
                where: params,
                relations: ['userBooks', 'userBooks.book']
            });
            if (!dbUser) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
            }
            logger_1.default.info(`User: ${JSON.stringify(dbUser)}`);
            const books = {
                past: [],
                present: [],
            };
            if (dbUser.userBooks) {
                dbUser.userBooks.forEach(userBook => {
                    if (userBook.status === 'past') {
                        books.past.push({
                            name: userBook.book.name,
                            userScore: userBook.score,
                        });
                    }
                    else if (userBook.status === 'present') {
                        books.present.push({
                            name: userBook.book.name,
                        });
                    }
                });
            }
            return {
                id: dbUser.id,
                name: dbUser.name,
                books: books
            };
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_entity_1.User.find();
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new user_entity_1.User();
            user.name = data.name;
            return yield user.save();
        });
    }
    static deleteOne(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield user_entity_1.User.delete(params.id);
            if (result.affected === 0) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
            }
        });
    }
    static borrowBook(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbBook = yield book_entity_1.Book.findOneBy({ id: params.bookId });
            if (!dbBook) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found');
            }
            const dbUserBook = yield userBook_entity_1.UserBook.findOneBy({ user: { id: params.userId }, book: { id: params.bookId } });
            if (dbUserBook) {
                throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Book is already borrowed by user');
            }
            logger_1.default.info(`Book: ${JSON.stringify(dbBook)}`);
            yield userBook_entity_1.UserBook.create({
                user: { id: params.userId },
                book: { id: params.bookId },
                status: 'present'
            }).save();
        });
    }
    static returnBook(params, score) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbUserBook = yield userBook_entity_1.UserBook.findOneBy({ user: { id: params.userId }, book: { id: params.bookId } });
            if (!dbUserBook) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Book is not borrowed by user');
            }
            if (dbUserBook.status === 'past') {
                throw new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Book is already returned by user');
            }
            dbUserBook.status = 'past';
            dbUserBook.score = score;
            return yield dbUserBook.save();
        });
    }
}
exports.default = UserService;
