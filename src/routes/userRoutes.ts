import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { BorrowingController } from '../controllers/borrowingController';
import { validateDto } from '../middlewares/validationMiddleware';
import { CreateUserDto } from '../dtos/user/createUserDto';
import { UpdateUserDto } from '../dtos/user/updateUserDto';
import { ReturnBookDto } from '../dtos/borrowing/returnBookDto';

const router = Router();
const userController = new UserController();
const borrowingController = new BorrowingController();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: List users
 *     tags: [Users]
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
 *         description: item limiet(optional)
 *     responses:
 *       200:
 *         description: user list
 *       500:
 *         description: server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user details
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: user id
 *     responses:
 *       200:
 *         description: user details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: user not found
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
router.get('/:id', userController.getUserById);

// Update user details
router.put('/:id', validateDto(UpdateUserDto), userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: user created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
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
router.post('/', validateDto(CreateUserDto), userController.createUser);

/**
 * @swagger
 * /:userId/borrow/:bookId:
 *   post:
 *     summary: Borrow book
 *     tags: [Borrowings]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       201:
 *         description: borrow book record created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Borrowing'
 *       400:
 *         description: invalid input or the book already borrowed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: user or book not found
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
router.post('/:userId/borrow/:bookId', borrowingController.borrowBook);

/**
 * @swagger
 * /:userId/return/:bookId:
 *   post:
 *     summary: Return book
 *     tags: [Borrowings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: borrow id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *     responses:
 *       200:
 *         description: the book is returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Borrowing'
 *       400:
 *         description: invalid input or the book already returned
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: borrow record could not be found
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
router.post('/:userId/return/:bookId', validateDto(ReturnBookDto), borrowingController.returnBook);

export default router;
