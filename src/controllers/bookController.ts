import { Request, Response, NextFunction } from 'express';
import { BookService } from '../services/bookService';
import { getPaginationOptions } from '../utils/pagination';

export class BookController {
  private bookService: BookService;

  constructor() {
    this.bookService = new BookService();
  }

  getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paginationOptions = getPaginationOptions(req);
      const result = await this.bookService.getAllBooks(paginationOptions);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const book = await this.bookService.getBookById(id);
      res.status(200).json(book);
    } catch (error) {
      next(error);
    }
  };
}
