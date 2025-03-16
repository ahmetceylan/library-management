import { BorrowingRepository } from '../../../repositories/borrowingRepository';
import { Borrowing } from '../../../entities/Borrowing';
import { DataSource, Repository, IsNull, Not } from 'typeorm';
import DatabaseConnection from '../../../config/database';

jest.mock('typeorm');

jest.mock('../../../config/database', () => ({
  getInstance: jest.fn()
}));

jest.mock('../../../entities/Book', () => ({
  Book: class Book {
    id: number;
    name: string;
  }
}));

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

describe('BorrowingRepository', () => {
  let borrowingRepository: BorrowingRepository;
  let mockTypeormRepository: jest.Mocked<Repository<Borrowing>>;
  const mockQueryBuilder = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockTypeormRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn().mockReturnValue(mockQueryBuilder)
    } as unknown as jest.Mocked<Repository<Borrowing>>;

    (DatabaseConnection.getInstance as jest.Mock).mockReturnValue({
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository)
    });

    borrowingRepository = new BorrowingRepository();
  });

  describe('findUserPastBorrowings', () => {
    it('should call repository find with correct parameters', async () => {
      const userId = 1;
      const expectedBorrowings = [
        {
          id: 1,
          user: { id: userId },
          book: { id: 1, name: 'Book 1' },
          returnDate: new Date(),
          score: 5
        }
      ] as unknown as Borrowing[];
      mockTypeormRepository.find.mockResolvedValue(expectedBorrowings);

      const result = await borrowingRepository.findUserPastBorrowings(userId);

      expect(mockTypeormRepository.find).toHaveBeenCalledWith({
        where: {
          user: { id: userId },
          returnDate: Not(IsNull())
        },
        relations: ['book']
      });
      expect(result).toEqual(expectedBorrowings);
    });
  });

  describe('findActiveBorrowing', () => {
    it('should call repository findOne with correct parameters', async () => {
      const userId = 1;
      const bookId = 2;
      const expectedBorrowing = {
        id: 1,
        user: { id: userId },
        book: { id: bookId },
        borrowDate: new Date(),
        returnDate: null
      } as unknown as Borrowing;

      mockQueryBuilder.getOne.mockResolvedValue(expectedBorrowing);

      const result = await borrowingRepository.findActiveBorrowing(userId, bookId);

      expect(mockTypeormRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('borrowing.user', 'user');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('borrowing.book', 'book');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('borrowing.returnDate IS NULL');
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
      expect(result).toEqual(expectedBorrowing);
    });
  });

  describe('findUserActiveBorrowings', () => {
    it('should call repository find with correct parameters', async () => {
      const userId = 1;
      const expectedBorrowings = [{ id: 1, user: { id: userId }, book: { id: 1, name: 'Book 1' }, returnDate: null }] as unknown as Borrowing[];
      mockTypeormRepository.find.mockResolvedValue(expectedBorrowings);

      const result = await borrowingRepository.findUserActiveBorrowings(userId);

      expect(mockTypeormRepository.find).toHaveBeenCalledWith({
        where: {
          user: { id: userId },
          returnDate: IsNull()
        },
        relations: ['book']
      });
      expect(result).toEqual(expectedBorrowings);
    });
  });
});
