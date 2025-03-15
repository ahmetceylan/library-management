import { Request, Response, NextFunction } from 'express';
import * as winston from 'winston';
import { AppError } from '../utils/errors';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  winston.error(`${err.name}: ${err.message}`, { stack: err.stack });

  // General error handling
  res.status(500).json({
    status: 'error',
    message: 'Server error'
  });
};
