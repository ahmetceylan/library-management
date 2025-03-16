import { BookService } from '../../../services/bookService';

import { NotFoundError } from '../../../utils/errors';
import { CreateBookDto } from '../../../dtos/book/createBookDto';
import { BookRepository } from '../../../repositories/bookRepository';

// Mock the dependencies
jest.mock('../../../repositories/bookRepository');
jest.mock('../../../config/database');

describe('BookService', () => {
  let bookService: BookService;
  let bookRepositoryMock: jest.Mocked<BookRepository>;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    // Create a mock instance of BookRepository
    bookRepositoryMock = new BookRepository() as jest.Mocked<BookRepository>;

    // Create an instance of BookService with the mocked repository
    bookService = new BookService();
    // Replace the repository with our mock
    (bookService as any).bookRepository = bookRepositoryMock;
  });

  describe('getAllBooks', () => {
    it('should return a list of books with id and name only', async () => {
      // Arrange
      const mockBooks = [
        { id: 1, name: 'Book 1', created_at: new Date(), updated_at: new Date(), borrowings: [] },
        { id: 2, name: 'Book 2', created_at: new Date(), updated_at: new Date(), borrowings: [] }
      ];
      bookRepositoryMock.findAllBooks = jest.fn().mockResolvedValue([mockBooks, 2]);

      // Act
      const result = await bookService.getAllBooks({ page: 1, limit: 10, skip: 0 });

      // Assert
      expect(bookRepositoryMock.findAllBooks).toHaveBeenCalledWith({ page: 1, limit: 10, skip: 0 });
      expect(result).toEqual([
        { id: 1, name: 'Book 1' },
        { id: 2, name: 'Book 2' }
      ]);
    });
  });

  describe('getBookById', () => {
    it('should return book details with average score', async () => {
      // Arrange
      const bookId = 1;
      const mockBook = {
        id: bookId,
        name: 'Book 1',
        created_at: new Date(),
        updated_at: new Date(),
        borrowings: []
      };
      bookRepositoryMock.findBookById = jest.fn().mockResolvedValue(mockBook);
      bookRepositoryMock.getAverageScore = jest.fn().mockResolvedValue(4.5);

      // Act
      const result = await bookService.getBookById(bookId);

      // Assert
      expect(bookRepositoryMock.findBookById).toHaveBeenCalledWith(bookId);
      expect(bookRepositoryMock.getAverageScore).toHaveBeenCalledWith(bookId);
      expect(result).toEqual({
        id: bookId,
        name: 'Book 1',
        score: '4.50'
      });
    });

    it('should return -1 as score when book has no ratings', async () => {
      // Arrange
      const bookId = 1;
      const mockBook = {
        id: bookId,
        name: 'Book 1',
        created_at: new Date(),
        updated_at: new Date(),
        borrowings: []
      };
      bookRepositoryMock.findBookById = jest.fn().mockResolvedValue(mockBook);
      bookRepositoryMock.getAverageScore = jest.fn().mockResolvedValue(null);

      // Act
      const result = await bookService.getBookById(bookId);

      // Assert
      expect(result).toEqual({
        id: bookId,
        name: 'Book 1',
        score: -1
      });
    });

    it('should throw NotFoundError when book does not exist', async () => {
      // Arrange
      const bookId = 999;
      bookRepositoryMock.findBookById = jest.fn().mockResolvedValue(null);

      // Act & Assert
      await expect(bookService.getBookById(bookId)).rejects.toThrow(NotFoundError);
      expect(bookRepositoryMock.findBookById).toHaveBeenCalledWith(bookId);
    });
  });

  describe('createBook', () => {
    it('should create a new book successfully', async () => {
      // Arrange
      const createBookDto: CreateBookDto = { name: 'New Book' };
      const mockBook = { id: 1, name: 'New Book', created_at: new Date(), updated_at: new Date() };

      bookRepositoryMock.create = jest.fn().mockReturnValue(mockBook);
      bookRepositoryMock.save = jest.fn().mockResolvedValue(mockBook);

      // Act
      await bookService.createBook(createBookDto);

      // Assert
      expect(bookRepositoryMock.create).toHaveBeenCalledWith({ name: 'New Book' });
      expect(bookRepositoryMock.save).toHaveBeenCalledWith(mockBook);
    });
  });
});
