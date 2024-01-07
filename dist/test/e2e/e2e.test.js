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
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const data_source_1 = require("../../src/data-source");
const helper_1 = require("../helper");
let createdUserId;
let initialUserCount;
const newUser = { name: "t1-Ozgur Gurcan" };
let bookList = [];
let createdBookId;
let initialBookCount;
const newBook = { name: "t1-Necromancer" };
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield (0, data_source_1.initializeDataSource)();
    yield (connection === null || connection === void 0 ? void 0 : connection.synchronize());
    bookList = yield (0, helper_1.createBook)(['t1-Gods of Jade and Shadow', 't2-Angels and Demons']);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, helper_1.deleteBook)(bookList);
    yield data_source_1.AppDataSource.destroy();
    // await deleteUserBooks(createdUserId);
}));
describe('books API', () => {
    it('GET /books - Getting initial book list', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/books')
            .expect('Content-Type', /json/)
            .expect(200);
        initialBookCount = response.body.length;
    }));
    it('POST /books - Creating a book', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default)
            .post('/books')
            .send(newBook)
            .expect(201);
    }));
    it('GET /books - Getting created Book id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/books')
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body.length).toEqual(initialBookCount + 1);
        createdBookId = response.body[response.body.length - 1].id;
    }));
    it('GET /books/:id - Getting the created book', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default)
            .get(`/books/${createdBookId}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (res) {
            expect(res.body.id).toEqual(createdBookId);
            expect(res.body.name).toEqual(newBook.name);
            expect(res.body.score).toEqual(-1);
        });
    }));
    it('DELETE /books/:id - Deleting the created book', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default)
            .delete(`/books/${createdBookId}`)
            .expect(204);
    }));
    it('GET /books - Getting book list after deletion', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default)
            .get('/books')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (res) {
            expect(res.body).toHaveLength(initialBookCount);
        });
    }));
});
describe('users API', () => {
    it('GET /users - Getting initial user list', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/users')
            .expect('Content-Type', /json/)
            .expect(200);
        initialUserCount = response.body.length;
    }));
    it('POST /users - Creating a user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default)
            .post('/users')
            .send(newUser)
            .expect(201);
    }));
    it('GET /users - Getting created User id', () => __awaiter(void 0, void 0, void 0, function* () {
        const response = yield (0, supertest_1.default)(app_1.default)
            .get('/users')
            .expect('Content-Type', /json/)
            .expect(200);
        expect(response.body.length).toEqual(initialUserCount + 1);
        createdUserId = response.body[response.body.length - 1].id;
    }));
    it('GET /users/:id - Getting created user with no borrow history', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default)
            .get(`/users/${createdUserId}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (res) {
            expect(res.body.id).toEqual(createdUserId);
            expect(res.body.name).toEqual(newUser.name);
            expect(res.body.books).toBeDefined();
            expect(res.body.books.past).toHaveLength(0);
            expect(res.body.books.present).toHaveLength(0);
        });
    }));
    it('POST /users/:userId/borrow/:bookId - User borrowed a book successfully just the first time', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default)
            .post(`/users/${createdUserId}/borrow/${bookList[0]}`)
            .expect(204);
        yield (0, supertest_1.default)(app_1.default)
            .post(`/users/${createdUserId}/borrow/${bookList[0]}`)
            .expect(400);
    }));
    it('GET /users/:id - Getting a user with his past and current book borrow list', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default)
            .get(`/users/${createdUserId}`)
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (res) {
            expect(res.body.id).toEqual(createdUserId);
            expect(res.body.name).toEqual(newUser.name);
            expect(res.body.books).toBeDefined();
            expect(res.body.books.past).toHaveLength(0);
            expect(res.body.books.present).toHaveLength(1);
        });
    }));
    it('POST /users/:userId/return/:bookId - User returning a book with his score', () => __awaiter(void 0, void 0, void 0, function* () {
        const score = {
            "score": 9
        };
        yield (0, supertest_1.default)(app_1.default)
            .post(`/users/${createdUserId}/borrow/${bookList[1]}`)
            .expect(204);
        yield (0, supertest_1.default)(app_1.default)
            .post(`/users/${createdUserId}/return/${bookList[1]}`)
            .send(score)
            .expect(204);
        yield (0, supertest_1.default)(app_1.default)
            .post(`/users/${createdUserId}/return/${bookList[1]}`)
            .send(score)
            .expect(400);
    }));
    it('DELETE /users/:id - Deleting the created user', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default)
            .delete(`/users/${createdUserId}`)
            .expect(204);
    }));
    it('GET /users - Getting user list after deletion', () => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, supertest_1.default)(app_1.default)
            .get('/users')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(function (res) {
            expect(res.body).toHaveLength(initialUserCount);
        });
    }));
});
