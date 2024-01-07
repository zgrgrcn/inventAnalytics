import {NextFunction, Request, Response} from "express";
import logger from "../utils/logger";
import BooksService from "../services/book.service";

class BooksController {
    static async getBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const books = await BooksService.getAll();
            logger.info(`Books count: ${books.length}`);
            res.json(books);
        } catch (error) {
            next(error);
        }
    }

    static async createBook(req: Request, res: Response, next: NextFunction) {
        try {
            const book = await BooksService.create(req.body);
            logger.info(`Book created with ID: ${book.id}`);
            res.status(201).json();
        } catch (error) {
            next(error);
        }
    }

    static async getBook(req: Request, res: Response, next: NextFunction) {
        try {
            const bookId = parseInt(req.params.bookId);
            const book = await BooksService.getOne({id: bookId});
            if (!book) {
                res.status(404).json({message: "Book not found"});
                return;
            }
            logger.info(`Fetched Book: ${JSON.stringify(book)}`);
            res.json(book);
        } catch (error) {
            next(error);
        }
    }

    static async deleteBook(req: Request, res: Response, next: NextFunction) {
        try {
            const bookId = parseInt(req.params.bookId);
            await BooksService.deleteOne({id: bookId});
            logger.info(`Book with ID: ${bookId} deleted`);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default BooksController;
