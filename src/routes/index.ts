import { Router } from 'express';
import userRoutes from './userRoutes';
import bookRoutes from './bookRoutes';

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: user management and borrow operations
 *   - name: Books
 *     description: book management
 */

router.use('/users', userRoutes);
router.use('/books', bookRoutes);

export default router;
