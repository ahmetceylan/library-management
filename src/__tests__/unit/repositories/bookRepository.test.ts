import { DataSource, Repository } from 'typeorm';
import { Book } from '../../../entities';
import { BookRepository } from '../../../repositories/bookRepository';
import DatabaseConnection from '../../../config/database';

jest.mock('typeorm');

jest.mock('../../../config/database', () => ({
  getInstance: jest.fn()
}));
// Entity mocks
jest.mock('../../../entities/Book', () => ({
  Book: class Book {
    id: number;
    name: string;
  }
}));

// Diğer entity'leri de mock'la
jest.mock('../../../entities/User', () => ({
  User: class User {
    id: number;
    name: string;
  }
}));

jest.mock('../../../entities/Borrowing', () => ({
  Borrowing: class Borrowing {
    id: number;
    user: any;
    book: any;
    borrowDate: Date;
    returnDate: Date | null;
    score: number | null;
  }
}));

describe('BookRepository', () => {
  let bookRepository: BookRepository;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockTypeormRepository: jest.Mocked<Repository<Book>>;

  beforeEach(() => {
    jest.clearAllMocks();

    mockTypeormRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn()
    } as unknown as jest.Mocked<Repository<Book>>;

    (DatabaseConnection.getInstance as jest.Mock).mockReturnValue({
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository)
    });

    bookRepository = new BookRepository();
  });

  describe('findBookById', () => {
    it('should call repository findOne with correct parameters', async () => {
      const bookId = 1;
      const expectedBook = { id: bookId, name: 'Book 1' } as Book;
      mockTypeormRepository.findOne.mockResolvedValue(expectedBook);

      const result = await bookRepository.findBookById(bookId);

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: bookId },
        relations: ['borrowings']
      });
      expect(result).toEqual(expectedBook);
    });
  });
  describe('findAllBooks', () => {
    it('should call repository findAndCount with correct parameters', async () => {
      const paginationOptions = { page: 1, limit: 10, skip: 0 };
      const expectedBooks = [{ id: 1, name: 'Book 1' }] as Book[];
      mockTypeormRepository.findAndCount.mockResolvedValue([expectedBooks, 1]);

      const result = await bookRepository.findAllBooks(paginationOptions);

      expect(mockTypeormRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { name: 'ASC' }
      });
      expect(result).toEqual([expectedBooks, 1]);
    });
  });

  describe('getAverageScore', () => {
    it('should return null when book has no ratings', async () => {
      const bookId = 1;
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ avgScore: null })
      };
      mockTypeormRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await bookRepository.getAverageScore(bookId);

      expect(result).toBeNull();
    });
    it('should return average score when book has ratings', async () => {
      const bookId = 1;
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({ avgScore: '4.5' })
      };
      mockTypeormRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await bookRepository.getAverageScore(bookId);

      expect(mockTypeormRepository.createQueryBuilder).toHaveBeenCalledWith('book');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('book.borrowings', 'borrowing');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith('AVG(borrowing.score)', 'avgScore');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('book.id = :bookId', { bookId });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('borrowing.score IS NOT NULL');
      expect(result).toEqual(4.5);
    });
  });

  describe('isBookBorrowed', () => {
    it('should return false when book is not borrowed', async () => {
      const bookId = 1;
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(0)
      };
      mockTypeormRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await bookRepository.isBookBorrowed(bookId);

      expect(result).toBe(false);
    });
    it('should return true when book is currently borrowed', async () => {
      const bookId = 1;
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1)
      };
      mockTypeormRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await bookRepository.isBookBorrowed(bookId);

      expect(mockTypeormRepository.createQueryBuilder).toHaveBeenCalledWith('book');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('book.borrowings', 'borrowing');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('book.id = :bookId', { bookId });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('borrowing.returnDate IS NULL');
      expect(result).toBe(true);
    });
  });
});
