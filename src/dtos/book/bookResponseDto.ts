export class BookResponseDto {
  id: number;
  name: string;
  score?: string | number; // -1 veya string olarak ortalama puan

  constructor(partial: Partial<BookResponseDto>) {
    Object.assign(this, partial);
  }
}
