import { Router } from 'express';
import { BookController } from '../controllers/bookController';
import { validateDto } from '../middlewares/validationMiddleware';

const router = Router();
const bookController = new BookController();

// Book routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
export default router;
