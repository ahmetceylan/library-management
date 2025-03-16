import { Request, Response, NextFunction } from 'express';
import { BorrowingService } from '../services/borrowingService';
export class BorrowingController {
  private borrowingService: BorrowingService;

  constructor() {
    this.borrowingService = new BorrowingService();
  }

  borrowBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId);
      const bookId = parseInt(req.params.bookId);

      await this.borrowingService.borrowBook(userId, bookId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
