import {Router} from 'express';
import validate from '../middlewares/validate';
import userSchema from '../validations/schemas/user.schema';
import UsersController from '../controllers/users.controller';

export const router = Router();

router.route('/')
    .get(validate(userSchema.getAll), UsersController.getUsers)
    .post(validate(userSchema.create), UsersController.createUser);

router.route('/:userId')
    .get(validate(userSchema.getOne), UsersController.getUser)
    .delete(validate(userSchema.deleteOne), UsersController.deleteUser);

router.route('/:userId/borrow/:bookId')
    .post(validate(userSchema.borrowBook), UsersController.borrowBook);

router.route('/:userId/return/:bookId')
    .post(validate(userSchema.returnBook), UsersController.returnBook);


export default router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *       example:
 *         id: 1
 *         name: John Doe
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: The user description by id
 *         contents:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: The user was not found
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *       500:
 *         description: Some server error
 */

/**
 * @swagger
 * /users/{userId}/borrow/{bookId}:
 *   post:
 *     summary: Borrow a book
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the user borrowing the book
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the book to borrow
 *     responses:
 *       200:
 *         description: The book was successfully borrowed by the user
 *       404:
 *         description: The user or book was not found
 */

/**
 * @swagger
 * /users/{userId}/return/{bookId}:
 *   post:
 *     summary: Return a borrowed book and optionally score it
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the user returning the book
 *       - in: path
 *         name: bookId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The id of the book to return
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               score:
 *                 type: integer
 *                 description: The score given by the user to the book
 *                 minimum: 0
 *                 maximum: 10
 *             required:
 *               - score
 *     responses:
 *       200:
 *         description: The book was successfully returned and scored by the user
 *       404:
 *         description: The user or book was not found
 */
