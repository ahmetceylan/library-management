import { UserRepository } from '../../../repositories/userRepository';
import { User } from '../../../entities/User';
import { Repository } from 'typeorm';
import DatabaseConnection from '../../../config/database';

// Mock DatabaseConnection
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

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockTypeormRepository: jest.Mocked<Repository<User>>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create mock for TypeORM Repository
    mockTypeormRepository = {
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      createQueryBuilder: jest.fn()
    } as unknown as jest.Mocked<Repository<User>>;

    // Mock DatabaseConnection.getInstance().getRepository
    (DatabaseConnection.getInstance as jest.Mock).mockReturnValue({
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository)
    });

    // Create UserRepository instance
    userRepository = new UserRepository();
  });

  describe('findAllUsers', () => {
    it('should call repository findAndCount with correct parameters', async () => {
      // Arrange
      const paginationOptions = { page: 1, limit: 10, skip: 0 };
      const expectedUsers = [{ id: 1, name: 'User 1' }] as unknown as User[];
      mockTypeormRepository.findAndCount.mockResolvedValue([expectedUsers, 1]);

      // Act
      const result = await userRepository.findAllUsers(paginationOptions);

      // Assert
      expect(mockTypeormRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { name: 'ASC' }
      });
      expect(result).toEqual([expectedUsers, 1]);
    });
  });

  describe('findUserById', () => {
    it('should call repository findOne with correct parameters', async () => {
      // Arrange
      const userId = 1;
      const expectedUser = { id: userId, name: 'User 1' } as unknown as User;
      mockTypeormRepository.findOne.mockResolvedValue(expectedUser);

      // Act
      const result = await userRepository.findUserById(userId);

      // Assert
      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['borrowings', 'borrowings.book']
      });
      expect(result).toEqual(expectedUser);
    });
  });

  describe('create', () => {
    it('should call repository create with correct parameters', () => {
      // Arrange
      const userData = { name: 'New User' };
      const expectedUser = { id: 1, name: 'New User' };
      mockTypeormRepository.create.mockReturnValue(expectedUser as User);

      // Act
      const result = userRepository.create(userData);

      // Assert
      expect(mockTypeormRepository.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(expectedUser);
    });
  });

  describe('save', () => {
    it('should call repository save with correct parameters', async () => {
      // Arrange
      const user = { id: 1, name: 'User 1' } as User;
      mockTypeormRepository.save.mockResolvedValue(user);

      // Act
      const result = await userRepository.save(user);

      // Assert
      expect(mockTypeormRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });

  describe('getUserBorrowings', () => {
    it('should return user borrowings', async () => {
      // Arrange
      const userId = 1;
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue({
          id: userId,
          name: 'User 1',
          borrowings: [
            { id: 1, book: { id: 1, name: 'Book 1' }, returnDate: new Date(), score: 5 },
            { id: 2, book: { id: 2, name: 'Book 2' }, returnDate: null, score: null }
          ]
        })
      };
      mockTypeormRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      // Act
      const result = await userRepository.getUserBorrowings(userId);

      // Assert
      expect(mockTypeormRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('user.borrowings', 'borrowing');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('borrowing.book', 'book');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.id = :userId', { userId });
      expect(result).toHaveLength(2);
    });

    it('should return empty array when user has no borrowings', async () => {
      // Arrange
      const userId = 1;
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null)
      };
      mockTypeormRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      // Act
      const result = await userRepository.getUserBorrowings(userId);

      // Assert
      expect(result).toEqual([]);
    });
  });
});
