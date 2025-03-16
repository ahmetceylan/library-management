import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class BorrowBookDto {
  @IsNotEmpty({ message: 'User ID is required' })
  @IsNumber({}, { message: 'User ID must be a number' })
  @IsPositive({ message: 'User ID must be positive' })
  userId: number;

  @IsNotEmpty({ message: 'Book ID is required' })
  @IsNumber({}, { message: 'Book ID must be a number' })
  @IsPositive({ message: 'Book ID must be positive' })
  bookId: number;
}
