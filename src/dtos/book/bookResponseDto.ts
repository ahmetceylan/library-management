export class BookResponseDto {
  id: number;
  name: string;
  score?: string | number;

  constructor(partial: Partial<BookResponseDto>) {
    Object.assign(this, partial);
  }
}
