import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { validateDto } from '../middlewares/validationMiddleware';
import { CreateUserDto } from '../dtos/user/createUserDto';

const router = Router();
const userController = new UserController();

// Get user details
router.get('/:id', userController.getUserById);

// Create a new user
router.post('/', validateDto(CreateUserDto), userController.createUser);

export default router;
