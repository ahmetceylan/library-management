import { Repository, DataSource } from 'typeorm';
import { Book } from '../entities/Book';
import { PaginationOptions } from '../utils/pagination';
import DatabaseConnection from '../config/database';

export class BookRepository {
  private repository: Repository<Book>;

  constructor() {
    this.repository = DatabaseConnection.getInstance().getRepository(Book);
  }

  async findAllBooks(options: PaginationOptions): Promise<[Book[], number]> {
    return this.repository.findAndCount({
      skip: options.skip,
      take: options.limit,
      order: {
        name: 'ASC'
      }
    });
  }

  async findBookById(id: number): Promise<Book | null> {
    return this.repository.findOne({
      where: { id },
      relations: ['borrowings']
    });
  }

  create(bookData: Partial<Book>): Book {
    return this.repository.create(bookData);
  }

  async save(book: Book): Promise<Book> {
    return this.repository.save(book);
  }

  async update(id: number, bookData: Partial<Book>): Promise<Book | null> {
    await this.repository.update(id, bookData);
    return this.findBookById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
  async getAverageScore(bookId: number): Promise<number | null> {
    const result = await this.repository
      .createQueryBuilder('book')
      .leftJoin('book.borrowings', 'borrowing')
      .select('AVG(borrowing.score)', 'avgScore')
      .where('book.id = :bookId', { bookId })
      .andWhere('borrowing.score IS NOT NULL')
      .getRawOne();

    return result?.avgScore ? parseFloat(result.avgScore) : null;
  }
}
