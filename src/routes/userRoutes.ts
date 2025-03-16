import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { userValidationSchema } from '../utils/validationSchemas';
import { validateRequest } from '../middlewares/validator';
import { validateDto } from '../middlewares/validationMiddleware';
import { CreateUserDto } from '../dtos/user/createUserDto';

const router = Router();
const userController = new UserController();

// List all users
router.get('/', userController.getAllUsers);

// Get user details
router.get('/:id', userController.getUserById);

// Create a new user
router.post('/', validateDto(CreateUserDto), userController.createUser);

export default router;
