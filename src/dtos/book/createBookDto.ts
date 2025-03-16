import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Length(2, 200, { message: 'Name must be between 2 and 200 characters' })
  name: string;
}
