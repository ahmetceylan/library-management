import { BorrowingRepository } from '../repositories/borrowingRepository';
import { UserRepository } from '../repositories/userRepository';
import { BookRepository } from '../repositories/bookRepository';
import { NotFoundError, ConflictError } from '../utils/errors';
import { ReturnBookDto } from '../dtos/borrowing/returnBookDto';

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

  async returnBook(userId: number, bookId: number, returnBookDto: ReturnBookDto): Promise<void> {
    const user = await this.userRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundError(`User with ID: ${userId} not found`);
    }

    const book = await this.bookRepository.findBookById(bookId);
    if (!book) {
      throw new NotFoundError(`Book with ID: ${bookId} not found`);
    }

    const borrowing = await this.borrowingRepository.findActiveBorrowing(userId, bookId);
    if (!borrowing) {
      throw new NotFoundError(`No active borrowing found for user ${userId} and book ${bookId}`);
    }

    borrowing.returnDate = new Date();
    borrowing.score = returnBookDto.score;

    await this.borrowingRepository.save(borrowing);

    return;
  }
}
