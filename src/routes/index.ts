import { Router } from 'express';
import userRoutes from './userRoutes';

const router = Router();

// Main API routes
router.use('/users', userRoutes);

export default router;
