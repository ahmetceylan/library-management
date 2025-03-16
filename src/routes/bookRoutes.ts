import { Router } from 'express';
import { BookController } from '../controllers/bookController';
import { validateDto } from '../middlewares/validationMiddleware';
import { CreateBookDto } from '../dtos/book/createBookDto';
import { UpdateBookDto } from '../dtos/book/updateBookDto';

const router = Router();
const bookController = new BookController();

// Book routes
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', validateDto(CreateBookDto), bookController.createBook);

// Update Book
router.put('/:id', validateDto(UpdateBookDto), bookController.updateBook);
//Delete Book
router.delete('/;id', bookController.deleteBook);

export default router;
