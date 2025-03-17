import { UserRepository } from '../repositories/userRepository';
import { PaginationOptions } from '../utils/pagination';
import { ConflictError, NotFoundError } from '../utils/errors';
import { CreateUserDto } from '../dtos/user/createUserDto';
import { UserResponseDto } from '../dtos/user/userResponseDto';
import { UpdateUserDto } from '../dtos/user/updateUserDto';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(options: PaginationOptions): Promise<UserResponseDto[]> {
    const [users, _] = await this.userRepository.findAllUsers(options);

    return users.map((user) => ({
      id: user.id,
      name: user.name
    }));
  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundError(`User with ID: ${id} not found`);
    }

    const borrowings = await this.userRepository.getUserBorrowings(id);

    const pastBorrowings = borrowings
      .filter((b) => b.returnDate !== null)
      .map((b) => ({
        name: b.book.name,
        userScore: b.score
      }));

    const presentBorrowings = borrowings
      .filter((b) => b.returnDate === null)
      .map((b) => ({
        name: b.book.name
      }));

    return {
      id: user.id,
      name: user.name,
      books: {
        past: pastBorrowings,
        present: presentBorrowings
      }
    };
  }

  async createUser(createUserDto: CreateUserDto): Promise<void> {
    const user = this.userRepository.create({
      name: createUserDto.name
    });

    await this.userRepository.save(user);

    return;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto): Promise<void> {
    // Check if user exists
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new NotFoundError(`User with ID: ${id} not found`);
    }

    // Check if email is already in use by another user
    if (updateUserDto.email && updateUserDto.email !== existingUser.email) {
      const userWithSameEmail = await this.userRepository.findUserByEmail(updateUserDto.email);
      if (userWithSameEmail && userWithSameEmail.id !== id) {
        throw new ConflictError(`Email address ${updateUserDto.email} is already in use`);
      }
    }

    await this.userRepository.update(id, updateUserDto);

    return;
  }

  async deleteUser(id: number): Promise<void> {
    const existingUser = await this.userRepository.findUserById(id);
    if (!existingUser) {
      throw new NotFoundError(`User with ID: ${id} not found`);
    }

    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new Error(`Failed to delete user with ID: ${id}`);
    }
    return;
  }
}
