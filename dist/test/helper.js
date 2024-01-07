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
exports.deleteUserBooks = exports.deleteBook = exports.createBook = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../src/app"));
const logger_1 = __importDefault(require("../src/utils/logger"));
const createBook = (bookList) => __awaiter(void 0, void 0, void 0, function* () {
    const bookIdList = [];
    for (const bookName of bookList) {
        yield (0, supertest_1.default)(app_1.default)
            .post('/books')
            .send({ name: bookName })
            .expect(201);
    }
    const response = yield (0, supertest_1.default)(app_1.default)
        .get('/books')
        .expect('Content-Type', /json/)
        .expect(200);
    //bookList  count get last element
    for (let i = 0; i < bookList.length; i++) {
        bookIdList.push(response.body[response.body.length - bookList.length + i].id);
    }
    return bookIdList;
});
exports.createBook = createBook;
const deleteBook = (bookList) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Deleting books: ${bookList}`);
    for (const bookId of bookList) {
        yield (0, supertest_1.default)(app_1.default)
            .delete(`/books/${bookId}`)
            .expect(204);
    }
});
exports.deleteBook = deleteBook;
const deleteUserBooks = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.default.info(`Deleting user: ${userId}`);
    yield (0, supertest_1.default)(app_1.default)
        .delete(`/users/${userId}`)
        .expect(204);
});
exports.deleteUserBooks = deleteUserBooks;
