import {Book} from "../entity/book.entity";
import {User} from "../entity/user.entity";
import logger from "../utils/logger";
import {UserBook} from "../entity/userBook.entity";
import httpStatus from "http-status";
import ApiError from "../utils/apiError";

class UserService {
    static async getOne(params: any) {
        const dbUser = await User.findOne({
            where: params,
            relations: ['userBooks', 'userBooks.book']
        })

        if (!dbUser) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
        }
        logger.info(`User: ${JSON.stringify(dbUser)}`)

        const books: { past: { name: string; userScore?: number }[]; present: { name: string; }[] } = {
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
                } else if (userBook.status === 'present') {
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
    }

    static async getAll() {
        return await User.find()
    }

    static async create(data: { name: string }) {
        const user = new User()
        user.name = data.name
        return await user.save()
    }

    static async deleteOne(params: any) {
        const result = await User.delete(params.id)
        if (result.affected === 0) {
            throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
        }
    }

    static async borrowBook(params: any) {
        const dbBook = await Book.findOneBy({id: params.bookId})
        if (!dbBook) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Book not found')
        }
        const dbUserBook = await UserBook.findOneBy({user: {id: params.userId}, book: {id: params.bookId}})
        if (dbUserBook) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Book is already borrowed by user')
        }
        logger.info(`Book: ${JSON.stringify(dbBook)}`)
        await UserBook.create({
            user: {id: params.userId},
            book: {id: params.bookId},
            status: 'present'
        }).save()
    }

    static async returnBook(params: any, score: number) {
        const dbUserBook = await UserBook.findOneBy({user: {id: params.userId}, book: {id: params.bookId}})
        if (!dbUserBook) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Book is not borrowed by user')
        }
        if (dbUserBook.status === 'past') {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Book is already returned by user')
        }
        dbUserBook.status = 'past'
        dbUserBook.score = score
        return await dbUserBook.save()
    }
}

export default UserService

