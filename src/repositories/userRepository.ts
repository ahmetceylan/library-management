import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/User';
import { PaginationOptions } from '../utils/pagination';
import { Borrowing } from '../entities/Borrowing';
import DatabaseConnection from '../config/database';
import { UserResponseDto } from '../dtos/user/userResponseDto';

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    const dataSource: DataSource = DatabaseConnection.getInstance();
    this.repository = dataSource.getRepository(User);
  }

  async findAllUsers(options: PaginationOptions): Promise<[User[], number]> {
    return this.repository.findAndCount({
      skip: options.skip,
      take: options.limit,
      order: {
        name: 'ASC'
      }
    });
  }

  async findUserById(id: number): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['borrowings', 'borrowings.book']
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({
      where: { email }
    });
  }

  create(userData: Partial<User>): User {
    return this.repository.create(userData);
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.repository.update(id, userData);
    return this.findUserById(id) as unknown as User;
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async getUserBorrowings(userId: number): Promise<Borrowing[]> {
    const user = await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.borrowings', 'borrowing')
      .leftJoinAndSelect('borrowing.book', 'book')
      .where('user.id = :userId', { userId })
      .getOne();

    return user ? user.borrowings : [];
  }
}
