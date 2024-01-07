import {Router} from 'express';
import validate from '../middlewares/validate';
import bookSchema from '../validations/schemas/book.schema';
import BooksController from '../controllers/books.controller';

export const router = Router();

router.route('/')
    .get(validate(bookSchema.getAll), BooksController.getBooks)
    .post(validate(bookSchema.create), BooksController.createBook);

router.route('/:bookId')
    .get(validate(bookSchema.getOne), BooksController.getBook)
    .delete(validate(bookSchema.deleteOne), BooksController.deleteBook);

export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Book:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the book.
 *         name:
 *           type: string
 *           description: The name of the book.
 *       example:
 *         id: 1
 *         name: Neuromancer
 */

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Returns the list of all the books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: The list of the books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get the book by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The book id
 *     responses:
 *       200:
 *         description: The book description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: The book was not found
 */

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       200:
 *         description: The book was successfully created
 *       500:
 *         description: Some server error
 */
