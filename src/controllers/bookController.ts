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

  createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.bookService.createBook(req.body);
      res.status(201).send();
    } catch (error) {
      next(error);
    }
  };

  updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const book = await this.bookService.updateBook(id, req.body);
      res.status(200).json(book);
    } catch (error) {
      next(error);
    }
  };

  deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      await this.bookService.deleteBook(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
