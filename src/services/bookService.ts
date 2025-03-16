import { BookRepository } from '../repositories/bookRepository';
import { PaginationOptions } from '../utils/pagination';
import { NotFoundError } from '../utils/errors';
import { CreateBookDto } from '../dtos/book/createBookDto';
import { BookResponseDto } from '../dtos/book/bookResponseDto';
import { UpdateBookDto } from '../dtos/book/updateBookDto';

export class BookService {
  private bookRepository: BookRepository;

  constructor() {
    this.bookRepository = new BookRepository();
  }

  async getAllBooks(options: PaginationOptions): Promise<BookResponseDto[]> {
    const [books, _] = await this.bookRepository.findAllBooks(options);

    return books.map((book) => ({
      id: book.id,
      name: book.name
    }));
  }

  async getBookById(id: number): Promise<BookResponseDto> {
    const book = await this.bookRepository.findBookById(id);
    if (!book) {
      throw new NotFoundError(`Book with ID: ${id} not found`);
    }

    return {
      id: book.id,
      name: book.name,
    };
  }
}
