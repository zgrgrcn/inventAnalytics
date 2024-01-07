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
const user_service_1 = __importDefault(require("../../src/services/user.service"));
const user_entity_1 = require("../../src/entity/user.entity");
const book_entity_1 = require("../../src/entity/book.entity");
const userBook_entity_1 = require("../../src/entity/userBook.entity");
const apiError_1 = __importDefault(require("../../src/utils/apiError"));
const http_status_1 = __importDefault(require("http-status"));
jest.mock('../../src/entity/user.entity');
jest.mock('../../src/entity/book.entity');
jest.mock('../../src/entity/userBook.entity', () => ({
    UserBook: {
        create: jest.fn().mockImplementation(() => ({
            save: jest.fn()
        })),
        findOneBy: jest.fn()
    }
}));
describe('UserService', () => {
    describe('getOne', () => {
        it('should return a user if it exists', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = {
                id: 1,
                name: 'Test User',
                userBooks: []
            };
            user_entity_1.User.findOne.mockResolvedValue(mockUser);
            const result = yield user_service_1.default.getOne({ id: 1 });
            expect(user_entity_1.User.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['userBooks', 'userBooks.book'] });
            expect(result).toEqual({
                id: 1,
                name: 'Test User',
                books: { past: [], present: [] }
            });
        }));
        it('should throw an error if the user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            user_entity_1.User.findOne.mockResolvedValue(null);
            yield expect(user_service_1.default.getOne({ id: 1 }))
                .rejects
                .toThrow(new apiError_1.default(http_status_1.default.NOT_FOUND, 'User not found'));
        }));
    });
    describe('getAll', () => {
        it('should return all users', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUsers = [
                { id: 1, name: 'User One' },
                { id: 2, name: 'User Two' }
            ];
            user_entity_1.User.find.mockResolvedValue(mockUsers);
            const result = yield user_service_1.default.getAll();
            expect(user_entity_1.User.find).toHaveBeenCalled();
            expect(result).toEqual(mockUsers);
        }));
    });
    describe('create', () => {
        it('should create a user', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUser = { name: 'New User' };
            user_entity_1.User.prototype.save.mockResolvedValue({ id: 1, name: 'New User' });
            const result = yield user_service_1.default.create({ name: 'New User' });
            expect(result).toEqual({ id: 1, name: 'New User' });
        }));
    });
    describe('deleteOne', () => {
        it('should delete a user if it exists', () => __awaiter(void 0, void 0, void 0, function* () {
            user_entity_1.User.delete.mockResolvedValue({ affected: 1 });
            yield user_service_1.default.deleteOne({ id: 1 });
            expect(user_entity_1.User.delete).toHaveBeenCalledWith(1);
        }));
        it('should throw an error if the user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            user_entity_1.User.delete.mockResolvedValue({ affected: 0 });
            yield expect(user_service_1.default.deleteOne({ id: 1 }))
                .rejects
                .toThrow(new apiError_1.default(http_status_1.default.NOT_FOUND, 'User not found'));
        }));
    });
    describe('borrowBook', () => {
        // Setup mock responses
        beforeEach(() => {
            book_entity_1.Book.findOneBy.mockResolvedValue({ id: 1, name: 'Test Book' });
            userBook_entity_1.UserBook.findOneBy.mockResolvedValue(null);
        });
        it('should borrow a book successfully', () => __awaiter(void 0, void 0, void 0, function* () {
            yield user_service_1.default.borrowBook({ userId: 1, bookId: 1 });
            expect(userBook_entity_1.UserBook.create).toHaveBeenCalled();
        }));
        it('should throw error if book does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
            book_entity_1.Book.findOneBy.mockResolvedValue(null);
            yield expect(user_service_1.default.borrowBook({ userId: 1, bookId: 1 }))
                .rejects
                .toThrow(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found'));
        }));
        it('should throw error if book is already borrowed', () => __awaiter(void 0, void 0, void 0, function* () {
            userBook_entity_1.UserBook.findOneBy.mockResolvedValue({ id: 1, user: { id: 1 }, book: { id: 1 }, status: 'present' });
            yield expect(user_service_1.default.borrowBook({ userId: 1, bookId: 1 }))
                .rejects
                .toThrow(new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Book is already borrowed by user'));
        }));
    });
    describe('returnBook', () => {
        it('should allow a user to return a book', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserBook = {
                user: { id: 1 },
                book: { id: 1 },
                status: 'present',
                save: jest.fn().mockResolvedValue({
                    user: { id: 1 },
                    book: { id: 1 },
                    status: 'past',
                    score: 8
                })
            };
            userBook_entity_1.UserBook.findOneBy.mockResolvedValue(mockUserBook);
            const result = yield user_service_1.default.returnBook({ userId: 1, bookId: 1 }, 8);
            expect(userBook_entity_1.UserBook.findOneBy).toHaveBeenCalledWith({ user: { id: 1 }, book: { id: 1 } });
            expect(mockUserBook.status).toBe('past');
            expect(mockUserBook.save).toHaveBeenCalled();
            expect(result).toEqual(expect.objectContaining({ status: 'past', score: 8 }));
        }));
        it('should throw an error if the book is not borrowed', () => __awaiter(void 0, void 0, void 0, function* () {
            userBook_entity_1.UserBook.findOneBy.mockResolvedValue(null);
            yield expect(user_service_1.default.returnBook({ userId: 1, bookId: 1 }, 8))
                .rejects
                .toThrow(new apiError_1.default(http_status_1.default.NOT_FOUND, 'Book is not borrowed by user'));
        }));
        it('should throw an error if the book is already returned', () => __awaiter(void 0, void 0, void 0, function* () {
            const mockUserBook = {
                user: { id: 1 },
                book: { id: 1 },
                status: 'past'
            };
            userBook_entity_1.UserBook.findOneBy.mockResolvedValue(mockUserBook);
            yield expect(user_service_1.default.returnBook({ userId: 1, bookId: 1 }, 8))
                .rejects
                .toThrow(new apiError_1.default(http_status_1.default.BAD_REQUEST, 'Book is already returned by user'));
        }));
    });
});
