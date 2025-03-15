import { Router } from 'express';
import { UserController } from '../controllers/userController';

const router = Router();
const userController = new UserController();

// Get user details
router.get('/:id', userController.getUserById);

export default router;
