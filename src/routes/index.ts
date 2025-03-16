import { Router } from 'express';
import userRoutes from './userRoutes';
import bookRoutes from './bookRoutes';

const router = Router();

// Main API routes
router.use('/users', userRoutes);
router.use('/books', bookRoutes);

export default router;
