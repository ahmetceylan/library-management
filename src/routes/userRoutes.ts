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

// Get all users
router.get('/', userController.getAllUsers);

// Get user details
router.get('/:id', userController.getUserById);

// Update user details
router.put('/:id', validateDto(UpdateUserDto), userController.updateUser);

// Delete user
router.delete('/:id', userController.deleteUser);

// Create a new user
router.post('/', validateDto(CreateUserDto), userController.createUser);

// Borrowing routes
router.post('/:userId/borrow/:bookId', borrowingController.borrowBook);
router.post('/:userId/return/:bookId', validateDto(ReturnBookDto), borrowingController.returnBook);

export default router;
