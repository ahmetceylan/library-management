import { Repository, IsNull, Not } from 'typeorm';
import { Borrowing } from '../entities/Borrowing';
import { PaginationOptions } from '../utils/pagination';
import DatabaseConnection from '../config/database';

export class BorrowingRepository {
  private repository: Repository<Borrowing>;

  constructor() {
    this.repository = DatabaseConnection.getInstance().getRepository(Borrowing);
  }

  async findAllBorrowings(options: PaginationOptions): Promise<[Borrowing[], number]> {
    return this.repository.findAndCount({
      skip: options.skip,
      take: options.limit,
      relations: ['user', 'book'],
      order: {
        borrowDate: 'DESC'
      }
    });
  }

  async findBorrowingById(id: number): Promise<Borrowing | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['user', 'book']
    });
  }

  async findActiveBorrowing(userId: number | null, bookId: number): Promise<Borrowing | null> {
    const query = this.repository
      .createQueryBuilder('borrowing')
      .leftJoinAndSelect('borrowing.user', 'user')
      .leftJoinAndSelect('borrowing.book', 'book')
      .where('borrowing.returnDate IS NULL');

    if (userId !== null) {
      query.andWhere('user.id = :userId', { userId });
    }

    if (bookId) {
      query.andWhere('book.id = :bookId', { bookId });
    }

    return query.getOne();
  }

  create(borrowingData: Partial<Borrowing>): Borrowing {
    return this.repository.create(borrowingData);
  }

  async save(borrowing: Borrowing): Promise<Borrowing> {
    return this.repository.save(borrowing);
  }

  async update(id: number, borrowingData: Partial<Borrowing>): Promise<Borrowing | null> {
    await this.repository.update(id, borrowingData);
    return this.findBorrowingById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async findUserActiveBorrowings(userId: number): Promise<Borrowing[]> {
    return this.repository.find({
      where: {
        user: { id: userId },
        returnDate: IsNull()
      },
      relations: ['book']
    });
  }

  async findUserPastBorrowings(userId: number): Promise<Borrowing[]> {
    return this.repository.find({
      where: {
        user: { id: userId },
        returnDate: Not(IsNull())
      },
      relations: ['book']
    });
  }
}
