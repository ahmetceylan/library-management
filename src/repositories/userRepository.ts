import { Repository, EntityRepository } from 'typeorm';
import { User } from '../entities/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findUserById(id: number): Promise<User | null> {
    return this.findOne({
      where: { id },
      relations: ['borrowings', 'borrowings.book']
    });
  }
}
