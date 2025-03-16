import { Router } from 'express';
import { BookController } from '../controllers/bookController';
import { validateDto } from '../middlewares/validationMiddleware';
import { CreateBookDto } from '../dtos/book/createBookDto';
import { UpdateBookDto } from '../dtos/book/updateBookDto';

const router = Router();
const bookController = new BookController();

/**
 * @swagger
 * /books:
 *   get:
 *     summary: List books
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: page number (optional)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: item count per page(optional)
 *     responses:
 *       200:
 *         description: Book list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Book'
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *       500:
 *         description: server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', bookController.getAllBooks);

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get Book details by id
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Kitap ID
 *     responses:
 *       200:
 *         description: book details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       404:
 *         description: book could not be found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', bookController.getBookById);

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create new book
 *     tags: [Books]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book is created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 *       400:
 *         description: invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', validateDto(CreateBookDto), bookController.createBook);

// Update Book
router.put('/:id', validateDto(UpdateBookDto), bookController.updateBook);
//Delete Book
router.delete('/;id', bookController.deleteBook);

export default router;
