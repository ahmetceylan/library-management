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

    // calculate avg score
    const averageScore = await this.bookRepository.getAverageScore(id);

    return {
      id: book.id,
      name: book.name,
      score: averageScore !== null ? averageScore.toFixed(2) : -1
    };
  }

  async createBook(createBookDto: CreateBookDto): Promise<void> {
    const book = this.bookRepository.create({
      name: createBookDto.name
    });

    await this.bookRepository.save(book);

    return;
  }

  async updateBook(id: number, updateBookDto: UpdateBookDto): Promise<void> {
    const existingBook = await this.bookRepository.findBookById(id);
    if (!existingBook) {
      throw new NotFoundError(`Book with ID: ${id} not found`);
    }

    await this.bookRepository.update(id, {
      name: updateBookDto.name
    });

    return;
  }

  async deleteBook(id: number): Promise<void> {
    const existingBook = await this.bookRepository.findBookById(id);
    if (!existingBook) {
      throw new NotFoundError(`Book with ID: ${id} not found`);
    }

    const deleted = await this.bookRepository.delete(id);
    if (!deleted) {
      throw new Error(`Failed to delete book with ID: ${id}`);
    }
    return;
  }
}
