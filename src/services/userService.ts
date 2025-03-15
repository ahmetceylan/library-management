import { UserRepository } from '../repositories/userRepository';
import { PaginationOptions, PaginatedResponse, createPaginatedResponse } from '../utils/pagination';
import { NotFoundError, ConflictError } from '../utils/errors';
import { CreateUserDto } from '../dtos/user/createUserDto';
import { UserResponseDto } from '../dtos/user/userResponseDto';
import DatabaseConnection from '../config/database';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  }

  async getUserById(id: number): Promise<UserResponseDto> {
    const user = await this.userRepository.findUserById(id);
    if (!user) {
      throw new NotFoundError(`User with ID: ${id} not found`);
    }

    return new UserResponseDto({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      updated_at: user.updated_at
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    if (createUserDto?.email) {
      const existingUser = await this.userRepository.findUserByEmail(createUserDto.email);
      if (existingUser) {
        throw new ConflictError(`Email address ${createUserDto.email} is already in use`);
      }
    }

    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto?.email
    });

    const savedUser = await this.userRepository.save(user);

    return new UserResponseDto({
      id: savedUser.id,
      name: savedUser.name,
      email: savedUser.email,
      created_at: savedUser.created_at,
      updated_at: savedUser.updated_at
    });
  }
}
