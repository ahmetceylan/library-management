import { getCustomRepository } from 'typeorm';
import { UserRepository } from '../repositories/userRepository';
import { NotFoundError } from '../utils/errors';
import { UserResponseDto } from '../dtos/user/userResponseDto';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = getCustomRepository(UserRepository);
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
}
