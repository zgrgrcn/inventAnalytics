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
const book_service_1 = __importDefault(require("../services/book.service"));
class BooksController {
    static getBooks(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const books = yield book_service_1.default.getAll();
                logger_1.default.info(`Books count: ${books.length}`);
                res.json(books);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static createBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const book = yield book_service_1.default.create(req.body);
                logger_1.default.info(`Book created with ID: ${book.id}`);
                res.status(201).json();
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookId = parseInt(req.params.bookId);
                const book = yield book_service_1.default.getOne({ id: bookId });
                if (!book) {
                    res.status(404).json({ message: "Book not found" });
                    return;
                }
                logger_1.default.info(`Fetched Book: ${JSON.stringify(book)}`);
                res.json(book);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteBook(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const bookId = parseInt(req.params.bookId);
                yield book_service_1.default.deleteOne({ id: bookId });
                logger_1.default.info(`Book with ID: ${bookId} deleted`);
                res.status(204).send();
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.default = BooksController;
