import {NextFunction, Request, Response} from "express";
import logger from "../utils/logger";
import UserService from "../services/user.service";

class UsersController {
    static async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const data = await UserService.getAll();
            logger.info(`Users count: ${data.length}`)
            res.send(data)
        } catch (error) {
            next(error)
        }
    }

    static async createUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await UserService.create(req.body);
            logger.info(`User created with ID: ${user.id}`)
            res.status(201).send()
        } catch (error) {
            next(error)
        }
    }

    static async getUser(req: Request, res: Response, next: NextFunction) {
        try {
            const params = {
                id: parseInt(req.params.userId),
            }
            const data = await UserService.getOne(params);
            logger.info(`get User: ${JSON.stringify(data)}`)
            res.send(data)
        } catch (error) {
            next(error)
        }
    }

    static async deleteUser(req: Request, res: Response, next: NextFunction) {
        try {
            const params = {
                id: parseInt(req.params.userId),
            }
            const data = await UserService.deleteOne(params);
            logger.info(`delete User: ${data}`);
            res.status(204).send();
        } catch (error) {
            next(error)
        }
    }

    static async borrowBook(req: Request, res: Response, next: NextFunction) {
        try {
            const params = {
                userId: parseInt(req.params.userId),
                bookId: parseInt(req.params.bookId),
            }
            logger.info(`borrowBook: ${JSON.stringify(params)}`)
            await UserService.borrowBook(params);
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }

    static async returnBook(req: Request, res: Response, next: NextFunction) {
        try {
            const params = {
                userId: parseInt(req.params.userId),
                bookId: parseInt(req.params.bookId),
            }
            const score = req.body.score
            await UserService.returnBook(params, score);
            logger.info(`return Book: ${JSON.stringify(params)}`)
            res.status(204).send()
        } catch (error) {
            next(error)
        }
    }
}

export default UsersController;
