"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const validate_1 = __importDefault(require("../middlewares/validate"));
const book_schema_1 = __importDefault(require("../validations/schemas/book.schema"));
const books_controller_1 = __importDefault(require("../controllers/books.controller"));
exports.router = (0, express_1.Router)();
exports.router.route('/')
    .get((0, validate_1.default)(book_schema_1.default.getAll), books_controller_1.default.getBooks)
    .post((0, validate_1.default)(book_schema_1.default.create), books_controller_1.default.createBook);
exports.router.route('/:bookId')
    .get((0, validate_1.default)(book_schema_1.default.getOne), books_controller_1.default.getBook)
    .delete((0, validate_1.default)(book_schema_1.default.deleteOne), books_controller_1.default.deleteBook);
exports.default = exports.router;
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
