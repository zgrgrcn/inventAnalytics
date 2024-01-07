import {Request, Response, Router} from 'express';
import userRouter from './users.routes';
import bookRouter from './books.routes';

const router = Router();

router.use('/users', userRouter);
router.use('/books', bookRouter);
router.use('/', (req: Request, res: Response) => res.redirect('/api-docs'));


export default router;


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
