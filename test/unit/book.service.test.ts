import BooksService from '../../src/services/book.service';
import {Book} from '../../src/entity/book.entity';
import ApiError from '../../src/utils/apiError';
import httpStatus from 'http-status';

jest.mock('../../src/entity/book.entity');

describe('BooksService', () => {
    describe('getOne', () => {
        it('should return a book if it exists', async () => {
            const mockBook = {
                id: 1,
                name: 'Test Book',
                userBooks: [
                    {status: 'past', score: 5},
                    {status: 'past', score: 7}
                ]
            };
            (Book.findOne as jest.Mock).mockResolvedValue(mockBook);

            const result = await BooksService.getOne({id: 1});

            expect(Book.findOne).toHaveBeenCalledWith({where: {id: 1}, relations: ['userBooks', 'userBooks.user']});
            expect(result).toEqual({id: 1, name: 'Test Book', score: 6});
        });

        it('should throw an error if the book does not exist', async () => {
            (Book.findOne as jest.Mock).mockResolvedValue(null);

            await expect(BooksService.getOne({id: 1}))
                .rejects
                .toThrow(new ApiError(httpStatus.NOT_FOUND, 'Book not found'));
        });
    });

    describe('getAll', () => {
        it('should return all books', async () => {
            const mockBooks = [{id: 1, name: 'Test Book 1'}, {id: 2, name: 'Test Book 2'}];
            (Book.find as jest.Mock).mockResolvedValue(mockBooks);

            const result = await BooksService.getAll();

            expect(Book.find).toHaveBeenCalled();
            expect(result).toEqual(mockBooks);
        });
    });

    describe('create', () => {
        it('should create a book', async () => {
            const mockBook = {name: 'New Book'};
            (Book.prototype.save as jest.Mock).mockResolvedValue({id: 1, name: 'New Book'});

            const result = await BooksService.create({name: 'New Book'});

            expect(result).toEqual({id: 1, name: 'New Book'});
        });
    });

    describe('deleteOne', () => {
        it('should delete a book if it exists', async () => {
            (Book.delete as jest.Mock).mockResolvedValue({ affected: 1 });

            await BooksService.deleteOne({ id: 1 });

            expect(Book.delete).toHaveBeenCalledWith(1);
        });

        it('should throw an error if the book does not exist', async () => {
            (Book.delete as jest.Mock).mockResolvedValue({ affected: 0 });

            await expect(BooksService.deleteOne({ id: 1 }))
                .rejects
                .toThrow(new ApiError(httpStatus.NOT_FOUND, 'Book not found'));
        });
    });
});
