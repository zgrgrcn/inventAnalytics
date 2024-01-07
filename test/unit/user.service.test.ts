import UserService from '../../src/services/user.service';
import { User } from '../../src/entity/user.entity';
import { Book } from '../../src/entity/book.entity';
import { UserBook } from '../../src/entity/userBook.entity';
import ApiError from '../../src/utils/apiError';
import httpStatus from 'http-status';

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
        it('should return a user if it exists', async () => {
            const mockUser = {
                id: 1,
                name: 'Test User',
                userBooks: []
            };
            (User.findOne as jest.Mock).mockResolvedValue(mockUser);

            const result = await UserService.getOne({ id: 1 });

            expect(User.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['userBooks', 'userBooks.book'] });
            expect(result).toEqual({
                id: 1,
                name: 'Test User',
                books: { past: [], present: [] }
            });
        });

        it('should throw an error if the user does not exist', async () => {
            (User.findOne as jest.Mock).mockResolvedValue(null);

            await expect(UserService.getOne({ id: 1 }))
                .rejects
                .toThrow(new ApiError(httpStatus.NOT_FOUND, 'User not found'));
        });
    });

    describe('getAll', () => {
        it('should return all users', async () => {
            const mockUsers = [
                { id: 1, name: 'User One' },
                { id: 2, name: 'User Two' }
            ];
            (User.find as jest.Mock).mockResolvedValue(mockUsers);

            const result = await UserService.getAll();

            expect(User.find).toHaveBeenCalled();
            expect(result).toEqual(mockUsers);
        });
    });

    describe('create', () => {
        it('should create a user', async () => {
            const mockUser = { name: 'New User' };
            (User.prototype.save as jest.Mock).mockResolvedValue({ id: 1, name: 'New User' });

            const result = await UserService.create({ name: 'New User' });

            expect(result).toEqual({ id: 1, name: 'New User' });
        });
    });

    describe('deleteOne', () => {
        it('should delete a user if it exists', async () => {
            (User.delete as jest.Mock).mockResolvedValue({ affected: 1 });

            await UserService.deleteOne({ id: 1 });

            expect(User.delete).toHaveBeenCalledWith(1);
        });

        it('should throw an error if the user does not exist', async () => {
            (User.delete as jest.Mock).mockResolvedValue({ affected: 0 });

            await expect(UserService.deleteOne({ id: 1 }))
                .rejects
                .toThrow(new ApiError(httpStatus.NOT_FOUND, 'User not found'));
        });
    });

    describe('borrowBook', () => {
        beforeEach(() => {
            (Book.findOneBy as jest.Mock).mockResolvedValue({ id: 1, name: 'Test Book' });
            (UserBook.findOneBy as jest.Mock).mockResolvedValue(null);
        });

        it('should borrow a book successfully', async () => {
            await UserService.borrowBook({ userId: 1, bookId: 1 });

            expect(UserBook.create).toHaveBeenCalled();
        });

        it('should throw error if book does not exist', async () => {
            (Book.findOneBy as jest.Mock).mockResolvedValue(null);

            await expect(UserService.borrowBook({ userId: 1, bookId: 1 }))
                .rejects
                .toThrow(new ApiError(httpStatus.NOT_FOUND, 'Book not found'));
        });

        it('should throw error if book is already borrowed', async () => {
            (UserBook.findOneBy as jest.Mock).mockResolvedValue({ id: 1, user: { id: 1 }, book: { id: 1 }, status: 'present' });

            await expect(UserService.borrowBook({ userId: 1, bookId: 1 }))
                .rejects
                .toThrow(new ApiError(httpStatus.BAD_REQUEST, 'Book is already borrowed by user'));
        });
    });

    describe('returnBook', () => {
        it('should allow a user to return a book', async () => {
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
            (UserBook.findOneBy as jest.Mock).mockResolvedValue(mockUserBook);

            const result = await UserService.returnBook({ userId: 1, bookId: 1 }, 8);

            expect(UserBook.findOneBy).toHaveBeenCalledWith({ user: { id: 1 }, book: { id: 1 } });
            expect(mockUserBook.status).toBe('past');
            expect(mockUserBook.save).toHaveBeenCalled();
            expect(result).toEqual(expect.objectContaining({ status: 'past', score: 8 }));
        });

        it('should throw an error if the book is not borrowed', async () => {
            (UserBook.findOneBy as jest.Mock).mockResolvedValue(null);

            await expect(UserService.returnBook({ userId: 1, bookId: 1 }, 8))
                .rejects
                .toThrow(new ApiError(httpStatus.NOT_FOUND, 'Book is not borrowed by user'));
        });

        it('should throw an error if the book is already returned', async () => {
            const mockUserBook = {
                user: { id: 1 },
                book: { id: 1 },
                status: 'past'
            };
            (UserBook.findOneBy as jest.Mock).mockResolvedValue(mockUserBook);

            await expect(UserService.returnBook({ userId: 1, bookId: 1 }, 8))
                .rejects
                .toThrow(new ApiError(httpStatus.BAD_REQUEST, 'Book is already returned by user'));
        });
    });
});
