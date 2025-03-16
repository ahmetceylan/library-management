export class UserResponseDto {
  id: number;
  name: string;
  email?: string;
  books?: {
    past: Array<{
      name: string;
      userScore: number;
    }>;
    present: Array<{
      name: string;
    }>;
  };

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}
