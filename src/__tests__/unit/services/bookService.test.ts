import { BookService } from '../../../services/bookService';

import { NotFoundError } from '../../../utils/errors';
import { CreateBookDto } from '../../../dtos/book/createBookDto';
import { BookRepository } from '../../../repositories/bookRepository';

jest.mock('../../../repositories/bookRepository');
jest.mock('../../../config/database');

describe('BookService', () => {
  let bookService: BookService;
  let bookRepositoryMock: jest.Mocked<BookRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    bookRepositoryMock = new BookRepository() as jest.Mocked<BookRepository>;

    bookService = new BookService();

    (bookService as any).bookRepository = bookRepositoryMock;
  });

  describe('getAllBooks', () => {
    it('should return a list of books with id and name only', async () => {
      const mockBooks = [
        { id: 1, name: 'Book 1', created_at: new Date(), updated_at: new Date(), borrowings: [] },
        { id: 2, name: 'Book 2', created_at: new Date(), updated_at: new Date(), borrowings: [] }
      ];
      bookRepositoryMock.findAllBooks = jest.fn().mockResolvedValue([mockBooks, 2]);

      const result = await bookService.getAllBooks({ page: 1, limit: 10, skip: 0 });

      expect(bookRepositoryMock.findAllBooks).toHaveBeenCalledWith({ page: 1, limit: 10, skip: 0 });
      expect(result).toEqual([
        { id: 1, name: 'Book 1' },
        { id: 2, name: 'Book 2' }
      ]);
    });
  });

  describe('getBookById', () => {
    describe('createBook', () => {
      it('should create a new book successfully', async () => {
        const createBookDto: CreateBookDto = { name: 'New Book' };
        const mockBook = { id: 1, name: 'New Book', created_at: new Date(), updated_at: new Date() };

        bookRepositoryMock.create = jest.fn().mockReturnValue(mockBook);
        bookRepositoryMock.save = jest.fn().mockResolvedValue(mockBook);

        await bookService.createBook(createBookDto);

        expect(bookRepositoryMock.create).toHaveBeenCalledWith({ name: 'New Book' });
        expect(bookRepositoryMock.save).toHaveBeenCalledWith(mockBook);
      });
      it('should return -1 as score when book has no ratings', async () => {
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

        const result = await bookService.getBookById(bookId);

        expect(result).toEqual({
          id: bookId,
          name: 'Book 1',
          score: -1
        });
      });

      it('should return book details with average score', async () => {
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

        const result = await bookService.getBookById(bookId);

        expect(bookRepositoryMock.findBookById).toHaveBeenCalledWith(bookId);
        expect(bookRepositoryMock.getAverageScore).toHaveBeenCalledWith(bookId);
        expect(result).toEqual({
          id: bookId,
          name: 'Book 1',
          score: '4.50'
        });
      });
      it('should throw NotFoundError when book does not exist', async () => {
        const bookId = 999;
        bookRepositoryMock.findBookById = jest.fn().mockResolvedValue(null);

        await expect(bookService.getBookById(bookId)).rejects.toThrow(NotFoundError);
        expect(bookRepositoryMock.findBookById).toHaveBeenCalledWith(bookId);
      });
    });
  });
});
