"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_routes_1 = __importDefault(require("./users.routes"));
const books_routes_1 = __importDefault(require("./books.routes"));
const router = (0, express_1.Router)();
router.use('/users', users_routes_1.default);
router.use('/books', books_routes_1.default);
router.use('/', (req, res) => res.redirect('/api-docs'));
exports.default = router;
/**
 * @swagger
 * tags:
 *   name: Actuator
 *   description: Actuator services for application health and metrics
 */
/**
 * @swagger
 * /info:
 *   get:
 *     summary: Display application info
 *     tags: [Actuator]
 *     responses:
 *       200:
 *         description: Application information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 build:
 *                   type: object
 */
/**
 * @swagger
 * /health:
 *   get:
 *     summary: Display application health information
 *     tags: [Actuator]
 *     responses:
 *       200:
 *         description: Health status of the application
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 */
/**
 * @swagger
 * /metrics:
 *   get:
 *     summary: Display application metrics
 *     tags: [Actuator]
 *     responses:
 *       200:
 *         description: Metrics information for the application
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mem:
 *                   type: object
 *                   properties:
 *                     rss:
 *                       type: number
 *                       description: Resident set size
 *                     heapTotal:
 *                       type: number
 *                       description: Total size of the allocated heap
 *                     heapUsed:
 *                       type: number
 *                       description: Actual memory used during the execution
 *                     external:
 *                       type: number
 *                       description: V8 external memory
 *                     arrayBuffers:
 *                       type: number
 *                       description: Allocation for ArrayBuffer and SharedArrayBuffer
 *                 uptime:
 *                   type: number
 *                   description: Uptime of the application in seconds
 */
