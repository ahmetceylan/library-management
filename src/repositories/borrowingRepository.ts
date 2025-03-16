import { Repository, DataSource, IsNull, Not } from 'typeorm';
import { Borrowing } from '../entities/Borrowing';
import { PaginationOptions } from '../utils/pagination';
import DatabaseConnection from '../config/database';

export class BorrowingRepository {
  private repository: Repository<Borrowing>;

  constructor() {
    this.repository = DatabaseConnection.getInstance().getRepository(Borrowing);
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
  }
