import { UserService } from '../../../services/userService';

import { NotFoundError } from '../../../utils/errors';
import { CreateUserDto } from '../../../dtos/user/createUserDto';
import { UserRepository } from '../../../repositories/userRepository';

jest.mock('../../../repositories/userRepository');
jest.mock('../../../config/database');

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

describe('UserService', () => {
  let userService: UserService;
  let userRepositoryMock: jest.Mocked<UserRepository>;

  beforeEach(() => {
    jest.clearAllMocks();

    userRepositoryMock = new UserRepository() as jest.Mocked<UserRepository>;
    userService = new UserService();
    (userService as any).userRepository = userRepositoryMock;
  });

  describe('createUser', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: CreateUserDto = { name: 'New User' };
      const mockUser = { id: 1, name: 'New User', created_at: new Date(), updated_at: new Date() };

      userRepositoryMock.create = jest.fn().mockReturnValue(mockUser);
      userRepositoryMock.save = jest.fn().mockResolvedValue(mockUser);

      await userService.createUser(createUserDto);

      expect(userRepositoryMock.create).toHaveBeenCalledWith({ name: 'New User' });
      expect(userRepositoryMock.save).toHaveBeenCalledWith(mockUser);
    });
  });
  describe('getAllUsers', () => {
    it('should return a list of users with id and name only', async () => {
      const mockUsers = [
        { id: 1, name: 'User 1', created_at: new Date(), updated_at: new Date(), borrowings: [] },
        { id: 2, name: 'User 2', created_at: new Date(), updated_at: new Date(), borrowings: [] }
      ];
      userRepositoryMock.findAllUsers = jest.fn().mockResolvedValue([mockUsers, 2]);

      const result = await userService.getAllUsers({ page: 1, limit: 10, skip: 0 });

      expect(userRepositoryMock.findAllUsers).toHaveBeenCalledWith({ page: 1, limit: 10, skip: 0 });
      expect(result).toEqual([
        { id: 1, name: 'User 1' },
        { id: 2, name: 'User 2' }
      ]);
    });
  });

  describe('getUserById', () => {
    it('should throw NotFoundError when user does not exist', async () => {
      const userId = 999;
      userRepositoryMock.findUserById = jest.fn().mockResolvedValue(null);

      await expect(userService.getUserById(userId)).rejects.toThrow(NotFoundError);
      expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(userId);
    });
    it('should return user details with past and present borrowings', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        name: 'User 1',
        created_at: new Date(),
        updated_at: new Date(),
        borrowings: []
      };
      userRepositoryMock.findUserById = jest.fn().mockResolvedValue(mockUser);

      const mockBorrowings = [
        {
          id: 1,
          user: mockUser,
          book: { id: 1, name: 'Book 1' },
          borrowDate: new Date(),
          returnDate: new Date(),
          score: 5
        },
        {
          id: 2,
          user: mockUser,
          book: { id: 2, name: 'Book 2' },
          borrowDate: new Date(),
          returnDate: null,
          score: null
        }
      ];
      userRepositoryMock.getUserBorrowings = jest.fn().mockResolvedValue(mockBorrowings);

      const result = await userService.getUserById(userId);

      expect(userRepositoryMock.findUserById).toHaveBeenCalledWith(userId);
      expect(userRepositoryMock.getUserBorrowings).toHaveBeenCalledWith(userId);
      expect(result).toEqual({
        id: userId,
        name: 'User 1',
        books: {
          past: [{ name: 'Book 1', userScore: 5 }],
          present: [{ name: 'Book 2' }]
        }
      });
    });
  });
});
