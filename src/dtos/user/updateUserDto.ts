import { IsEmail, IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  @Length(2, 100, { message: 'Name must be between 2 and 100 characters' })
  name: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email format' })
  @Length(5, 100, { message: 'Email must be between 5 and 100 characters' })
  email?: string;
}
