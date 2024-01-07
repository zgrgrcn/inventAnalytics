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
const http_status_1 = __importDefault(require("http-status"));
const book_entity_1 = require("../entity/book.entity");
const apiError_1 = __importDefault(require("../utils/apiError"));
class BooksService {
    static getOne(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbBook = yield book_entity_1.Book.findOne({
                where: params,
                relations: ['userBooks', 'userBooks.user']
            });
            if (!dbBook) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found');
            }
            const score = this.calculateAverageScore(dbBook.userBooks);
            return {
                id: dbBook.id,
                name: dbBook.name,
                score: score !== null && score !== void 0 ? score : -1
            };
        });
    }
    static getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield book_entity_1.Book.find();
        });
    }
    static create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const book = new book_entity_1.Book();
            book.name = data.name;
            return yield book.save();
        });
    }
    static deleteOne(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield book_entity_1.Book.delete(params.id);
            if (result.affected === 0) {
                throw new apiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found');
            }
        });
    }
    static calculateAverageScore(userBooks) {
        if (!userBooks || userBooks.length === 0) {
            return undefined;
        }
        const pastScoredBooks = userBooks
            .filter(userBook => userBook.status === 'past' && userBook.score !== null)
            .map(userBook => userBook.score);
        if (pastScoredBooks.length > 0) {
            return pastScoredBooks.reduce((a, b) => a + b, 0) / pastScoredBooks.length;
        }
        return undefined;
    }
}
exports.default = BooksService;
