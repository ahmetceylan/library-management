import { Request } from 'express';

export interface PaginationOptions {
  page: number;
  limit: number;
  skip: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const getPaginationOptions = (req: Request): PaginationOptions => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const skip = (page - 1) * limit;

  return {
    page,
    limit,
    skip
  };
};

export const createPaginatedResponse = <T>(data: T[], total: number, options: PaginationOptions): PaginatedResponse<T> => {
  return {
    data,
    meta: {
      total,
      page: options.page,
      limit: options.limit,
      totalPages: Math.ceil(total / options.limit)
    }
  };
};
