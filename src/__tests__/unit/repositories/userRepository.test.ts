import { UserRepository } from '../../../repositories/userRepository';
import { User } from '../../../entities/User';
import { Repository } from 'typeorm';
import DatabaseConnection from '../../../config/database';

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

describe('UserRepository', () => {
  let userRepository: UserRepository;
  let mockTypeormRepository: jest.Mocked<Repository<User>>;

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
    } as unknown as jest.Mocked<Repository<User>>;

    (DatabaseConnection.getInstance as jest.Mock).mockReturnValue({
      getRepository: jest.fn().mockReturnValue(mockTypeormRepository)
    });

    userRepository = new UserRepository();
  });

  describe('findUserById', () => {
    it('should call repository findOne with correct parameters', async () => {
      const userId = 1;
      const expectedUser = { id: userId, name: 'User 1' } as unknown as User;
      mockTypeormRepository.findOne.mockResolvedValue(expectedUser);

      const result = await userRepository.findUserById(userId);

      expect(mockTypeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId },
        relations: ['borrowings', 'borrowings.book']
      });
      expect(result).toEqual(expectedUser);
    });
  });
  describe('findAllUsers', () => {
    it('should call repository findAndCount with correct parameters', async () => {
      // Arrange
      const paginationOptions = { page: 1, limit: 10, skip: 0 };
      const expectedUsers = [{ id: 1, name: 'User 1' }] as unknown as User[];
      mockTypeormRepository.findAndCount.mockResolvedValue([expectedUsers, 1]);

      const result = await userRepository.findAllUsers(paginationOptions);

      expect(mockTypeormRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { name: 'ASC' }
      });
      expect(result).toEqual([expectedUsers, 1]);
    });
  });

  describe('save', () => {
    it('should call repository save with correct parameters', async () => {
      const user = { id: 1, name: 'User 1' } as User;
      mockTypeormRepository.save.mockResolvedValue(user);

      const result = await userRepository.save(user);

      expect(mockTypeormRepository.save).toHaveBeenCalledWith(user);
      expect(result).toEqual(user);
    });
  });
  describe('create', () => {
    it('should call repository create with correct parameters', () => {
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

  describe('getUserBorrowings', () => {
    it('should return empty array when user has no borrowings', async () => {
      const userId = 1;
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null)
      };
      mockTypeormRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder as any);

      const result = await userRepository.getUserBorrowings(userId);

      expect(result).toEqual([]);
    });
    it('should return user borrowings', async () => {
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

      const result = await userRepository.getUserBorrowings(userId);

      expect(mockTypeormRepository.createQueryBuilder).toHaveBeenCalledWith('user');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('user.borrowings', 'borrowing');
      expect(mockQueryBuilder.leftJoinAndSelect).toHaveBeenCalledWith('borrowing.book', 'book');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('user.id = :userId', { userId });
      expect(result).toHaveLength(2);
    });
  });
});
