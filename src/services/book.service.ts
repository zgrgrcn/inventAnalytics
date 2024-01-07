import httpStatus from "http-status";
import {Book} from "../entity/book.entity";
import {UserBook} from "../entity/userBook.entity";
import ApiError from "../utils/apiError";

interface IGetOneParams {
    id: number;
}

interface ICreateBookData {
    name: string;
}

class BooksService {
    static async getOne(params: IGetOneParams) {
        const dbBook = await Book.findOne({
            where: params,
            relations: ['userBooks', 'userBooks.user']
        })

        if (!dbBook) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Book not found');
        }

        const score = this.calculateAverageScore(dbBook.userBooks);

        return {
            id: dbBook.id,
            name: dbBook.name,
            score: score ?? -1
        };


    }

    static async getAll() {
        return await Book.find()
    }

    static async create(data: ICreateBookData) {
        const book = new Book()
        book.name = data.name
        return await book.save()
    }

    static async deleteOne(params: { id: number }) {
        const result = await Book.delete(params.id);
        if (result.affected === 0) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Book not found')
        }
    }

    private static calculateAverageScore(userBooks: UserBook[] | undefined): number | undefined {
        if (!userBooks || userBooks.length === 0) {
            return undefined;
        }
        const pastScoredBooks = userBooks
            .filter(userBook => userBook.status === 'past' && userBook.score !== null)
            .map(userBook => userBook.score as number);

        if (pastScoredBooks.length > 0) {
            return pastScoredBooks.reduce((a, b) => a + b, 0) / pastScoredBooks.length;
        }

        return undefined;
    }
}

export default BooksService;
