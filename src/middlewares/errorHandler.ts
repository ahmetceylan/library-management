import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';
import { AppError } from '../utils/errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  winston.error(`${err.name}: ${err.message}`, { stack: err.stack });

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message
    });
    return;
  }

  // TypeORM error handling
  if (err.name === 'QueryFailedError') {
    res.status(400).json({
      status: 'error',
      message: 'Database operation failed'
    });
    return;
  }

  // General error handling
  res.status(500).json({
    status: 'error',
    message: 'Server error'
  });
};
