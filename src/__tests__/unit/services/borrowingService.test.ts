import { BorrowingService } from '../../../services/borrowingService';
import { NotFoundError, ConflictError } from '../../../utils/errors';
import { ReturnBookDto } from '../../../dtos/borrowing/returnBookDto';
import { BorrowingRepository } from '../../../repositories/borrowingRepository';
import { UserRepository } from '../../../repositories/userRepository';
import { BookRepository } from '../../../repositories/bookRepository';

// Mock dependencies
jest.mock('../../../repositories/borrowingRepository');
jest.mock('../../../repositories/userRepository');
jest.mock('../../../repositories/bookRepository');
jest.mock('../../../config/database', () => ({
  getInstance: jest.fn()
}));

describe('BorrowingService', () => {
  let borrowingService: BorrowingService;
  let borrowingRepositoryMock: jest.Mocked<BorrowingRepository>;
  let userRepositoryMock: jest.Mocked<UserRepository>;
  let bookRepositoryMock: jest.Mocked<BookRepository>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock instances
    borrowingRepositoryMock = new BorrowingRepository() as jest.Mocked<BorrowingRepository>;
    userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
    bookRepositoryMock = new BookRepository() as jest.Mocked<BookRepository>;

    // Mock repository constructors
    (BorrowingRepository as jest.Mock).mockImplementation(() => borrowingRepositoryMock);
    (UserRepository as jest.Mock).mockImplementation(() => userRepositoryMock);
    (BookRepository as jest.Mock).mockImplementation(() => bookRepositoryMock);

    // Create BorrowingService instance
    borrowingService = new BorrowingService();
  });

  describe('borrowBook', () => {
    it('should borrow a book successfully', async () => {
      // Arrange
      const userId = 1;
      const bookId = 2;
      const mockUser = { id: userId, name: 'User 1' };
      const mockBook = { id: bookId, name: 'Book 2' };
      const mockBorrowing = {
        id: 1,
        user: mockUser,
        book: mockBook,
        borrowDate: new Date(),
        returnDate: null,
        score: null
      };

      userRepositoryMock.findUserById = jest.fn().mockResolvedValue(mockUser);
      bookRepositoryMock.findBookById = jest.fn().mockResolvedValue(mockBook);
      borrowingRepositoryMock.findActiveBorrowing = jest.fn().mockResolvedValue(null);
      borrowingRepositoryMock.create = jest.fn().mockReturnValue(mockBorrowing);
      borrowingRepositoryMock.save = jest.fn().mockResolvedValue(mockBorrowing);

      // Act
      await borrowingService.borrowBook(userId, bookId);

      // Assert
      expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(userId);
      expect(bookRepositoryMock.findBookById).toHaveBeenCalledWith(bookId);
      expect(borrowingRepositoryMock.findActiveBorrowing).toHaveBeenCalledWith(null, bookId);
      expect(borrowingRepositoryMock.create).toHaveBeenCalled();
      expect(borrowingRepositoryMock.save).toHaveBeenCalledWith(mockBorrowing);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      // Arrange
      const userId = 999;
      const bookId = 1;
      userRepositoryMock.findUserById = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(borrowingService.borrowBook(userId, bookId)).rejects.toThrow(NotFoundError);
      expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundError when book does not exist', async () => {
      // Arrange
      const userId = 1;
      const bookId = 999;
      const mockUser = { id: userId, name: 'User 1' };

      userRepositoryMock.findUserById = jest.fn().mockResolvedValue(mockUser);
      bookRepositoryMock.findBookById = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(borrowingService.borrowBook(userId, bookId)).rejects.toThrow(NotFoundError);
      expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(userId);
      expect(bookRepositoryMock.findBookById).toHaveBeenCalledWith(bookId);
    });

    it('should throw ConflictError when book is already borrowed', async () => {
      // Arrange
      const userId = 1;
      const bookId = 2;
      const mockUser = { id: userId, name: 'User 1' };
      const mockBook = { id: bookId, name: 'Book 2' };
      const mockActiveBorrowing = {
        id: 1,
        user: { id: 3, name: 'Another User' },
        book: mockBook,
        borrowDate: new Date(),
        returnDate: null
      };

      userRepositoryMock.findUserById = jest.fn().mockResolvedValue(mockUser);
      bookRepositoryMock.findBookById = jest.fn().mockResolvedValue(mockBook);
      borrowingRepositoryMock.findActiveBorrowing = jest.fn().mockResolvedValue(mockActiveBorrowing);

      // Act & Assert
      await expect(borrowingService.borrowBook(userId, bookId)).rejects.toThrow(ConflictError);
      expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(userId);
      expect(bookRepositoryMock.findBookById).toHaveBeenCalledWith(bookId);
      expect(borrowingRepositoryMock.findActiveBorrowing).toHaveBeenCalledWith(null, bookId);
    });
  });

  describe('returnBook', () => {
    it('should return a book successfully', async () => {
      // Arrange
      const userId = 1;
      const bookId = 2;
      const returnBookDto: ReturnBookDto = { score: 8 };

      const mockUser = { id: userId, name: 'User 1' };
      const mockBook = { id: bookId, name: 'Book 2' };
      const mockBorrowing = {
        id: 1,
        user: mockUser,
        book: mockBook,
        borrowDate: new Date(),
        returnDate: null,
        score: null
      };

      userRepositoryMock.findUserById = jest.fn().mockResolvedValue(mockUser);
      bookRepositoryMock.findBookById = jest.fn().mockResolvedValue(mockBook);
      borrowingRepositoryMock.findActiveBorrowing = jest.fn().mockResolvedValue(mockBorrowing);
      borrowingRepositoryMock.save = jest.fn().mockImplementation(async (borrowing) => borrowing);

      // Act
      await borrowingService.returnBook(userId, bookId, returnBookDto);

      // Assert
      expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(userId);
      expect(bookRepositoryMock.findBookById).toHaveBeenCalledWith(bookId);
      expect(borrowingRepositoryMock.findActiveBorrowing).toHaveBeenCalledWith(userId, bookId);
      expect(borrowingRepositoryMock.save).toHaveBeenCalled();
      expect(borrowingRepositoryMock.save.mock.calls[0][0].returnDate).toBeDefined();
      expect(borrowingRepositoryMock.save.mock.calls[0][0].score).toBe(8);
    });

    it('should throw NotFoundError when user does not exist', async () => {
      // Arrange
      const userId = 999;
      const bookId = 1;
      const returnBookDto: ReturnBookDto = { score: 8 };

      userRepositoryMock.findUserById = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(borrowingService.returnBook(userId, bookId, returnBookDto)).rejects.toThrow(NotFoundError);
      expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(userId);
    });

    it('should throw NotFoundError when book does not exist', async () => {
      // Arrange
      const userId = 1;
      const bookId = 999;
      const returnBookDto: ReturnBookDto = { score: 8 };

      const mockUser = { id: userId, name: 'User 1' };

      userRepositoryMock.findUserById = jest.fn().mockResolvedValue(mockUser);
      bookRepositoryMock.findBookById = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(borrowingService.returnBook(userId, bookId, returnBookDto)).rejects.toThrow(NotFoundError);
      expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(userId);
      expect(bookRepositoryMock.findBookById).toHaveBeenCalledWith(bookId);
    });

    it('should throw NotFoundError when no active borrowing exists', async () => {
      // Arrange
      const userId = 1;
      const bookId = 2;
      const returnBookDto: ReturnBookDto = { score: 8 };

      const mockUser = { id: userId, name: 'User 1' };
      const mockBook = { id: bookId, name: 'Book 2' };

      userRepositoryMock.findUserById = jest.fn().mockResolvedValue(mockUser);
      bookRepositoryMock.findBookById = jest.fn().mockResolvedValue(mockBook);
      borrowingRepositoryMock.findActiveBorrowing = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(borrowingService.returnBook(userId, bookId, returnBookDto)).rejects.toThrow(NotFoundError);
      expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(userId);
      expect(bookRepositoryMock.findBookById).toHaveBeenCalledWith(bookId);
      expect(borrowingRepositoryMock.findActiveBorrowing).toHaveBeenCalledWith(userId, bookId);
    });
  });
});
