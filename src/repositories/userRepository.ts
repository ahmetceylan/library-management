import { Repository, DataSource } from 'typeorm';
import { User } from '../entities/User';
import { PaginationOptions } from '../utils/pagination';
import DatabaseConnection from '../config/database';

export class UserRepository {
  private repository: Repository<User>;

  constructor() {
    const dataSource: DataSource = DatabaseConnection.getInstance();
    this.repository = dataSource.getRepository(User);
  }
  async findUserById(id: number): Promise<User | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['borrowings', 'borrowings.book']
    });
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  create(userData: Partial<User>): User {
    return this.repository.create(userData);
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }
}
