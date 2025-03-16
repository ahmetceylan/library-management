import { IsNotEmpty, IsNumber, Min, Max } from 'class-validator';

export class ReturnBookDto {
  @IsNotEmpty({ message: 'Score is required' })
  @IsNumber({}, { message: 'Score must be a number' })
  @Min(1, { message: 'Score must be at least 1' })
  @Max(10, { message: 'Score must be at most 10' })
  score: number;
}
