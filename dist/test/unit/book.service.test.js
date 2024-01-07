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
const book_service_1 = __importDefault(require("../../src/services/book.service"));
const book_entity_1 = require("../../src/entity/book.entity");
const apiError_1 = __importDefault(require("../../src/utils/apiError"));
const http_status_1 = __importDefault(require("http-status"));
jest.mock('../../src/entity/book.entity');
describe('BooksService', () => {
    describe('getOne', () => {
        it('should return a book if it exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockBook = {
                id: 1,
                name: 'Test Book',
                userBooks: [
                    { status: 'past', score: 5 },
                    { status: 'past', score: 7 }
                ]
            };
            book_entity_1.Book.findOne.mockResolvedValue(mockBook);
            const result = yield book_service_1.default.getOne({ id: 1 });
            expect(book_entity_1.Book.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['userBooks', 'userBooks.user'] });
            expect(result).toEqual({ id: 1, name: 'Test Book', score: 6 });
        }));
        it('should throw an error if the book does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            book_entity_1.Book.findOne.mockResolvedValue(null);
            yield expect(book_service_1.default.getOne({ id: 1 }))
                .rejects
                .toThrow(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found'));
        }));
    });
    describe('getAll', () => {
        it('should return all books', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockBooks = [{ id: 1, name: 'Test Book 1' }, { id: 2, name: 'Test Book 2' }];
            book_entity_1.Book.find.mockResolvedValue(mockBooks);
            const result = yield book_service_1.default.getAll();
            expect(book_entity_1.Book.find).toHaveBeenCalled();
            expect(result).toEqual(mockBooks);
        }));
    });
    describe('create', () => {
        it('should create a book', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockBook = { name: 'New Book' };
            book_entity_1.Book.prototype.save.mockResolvedValue({ id: 1, name: 'New Book' });
            const result = yield book_service_1.default.create({ name: 'New Book' });
            expect(result).toEqual({ id: 1, name: 'New Book' });
        }));
    });
    describe('deleteOne', () => {
        it('should delete a book if it exists', () => __awaiter(void 0, void 0, void 0, function* () {
            book_entity_1.Book.delete.mockResolvedValue({ affected: 1 });
            yield book_service_1.default.deleteOne({ id: 1 });
            expect(book_entity_1.Book.delete).toHaveBeenCalledWith(1);
        }));
        it('should throw an error if the book does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            book_entity_1.Book.delete.mockResolvedValue({ affected: 0 });
            yield expect(book_service_1.default.deleteOne({ id: 1 }))
                .rejects
                .toThrow(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found'));
        }));
    });
});
