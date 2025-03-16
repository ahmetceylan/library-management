import { BorrowingRepository } from '../repositories/borrowingRepository';
import { UserRepository } from '../repositories/userRepository';
import { BookRepository } from '../repositories/bookRepository';
import { NotFoundError, ConflictError } from '../utils/errors';
export class BorrowingService {
  private borrowingRepository: BorrowingRepository;
  private userRepository: UserRepository;
  private bookRepository: BookRepository;

  constructor() {
    this.borrowingRepository = new BorrowingRepository();
    this.userRepository = new UserRepository();
    this.bookRepository = new BookRepository();
  }

  async borrowBook(userId: number, bookId: number): Promise<void> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError(`User with ID: ${userId} not found`);
    }

    const book = await this.bookRepository.findBookById(bookId);
    if (!book) {
      throw new NotFoundError(`Book with ID: ${bookId} not found`);
    }

    //check if the book already borrowed
    const activeBorrowing = await this.borrowingRepository.findActiveBorrowing(null, bookId);
    if (activeBorrowing) {
      throw new ConflictError(`Book with ID: ${bookId} is already borrowed`);
    }

    const borrowing = this.borrowingRepository.create({
      user,
      book,
      borrowDate: new Date(),
      returnDate: undefined,
      score: undefined
    });

    await this.borrowingRepository.save(borrowing);

    return;
  }

  }
