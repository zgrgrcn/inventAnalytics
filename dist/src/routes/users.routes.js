"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const validate_1 = __importDefault(require("../middlewares/validate"));
const user_schema_1 = __importDefault(require("../validations/schemas/user.schema"));
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
exports.router = (0, express_1.Router)();
exports.router.route('/')
    .get((0, validate_1.default)(user_schema_1.default.getAll), users_controller_1.default.getUsers)
    .post((0, validate_1.default)(user_schema_1.default.create), users_controller_1.default.createUser);
exports.router.route('/:userId')
    .get((0, validate_1.default)(user_schema_1.default.getOne), users_controller_1.default.getUser)
    .delete((0, validate_1.default)(user_schema_1.default.deleteOne), users_controller_1.default.deleteUser);
exports.router.route('/:userId/borrow/:bookId')
    .post((0, validate_1.default)(user_schema_1.default.borrowBook), users_controller_1.default.borrowBook);
exports.router.route('/:userId/return/:bookId')
    .post((0, validate_1.default)(user_schema_1.default.returnBook), users_controller_1.default.returnBook);
exports.default = exports.router;
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
