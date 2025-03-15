import { Request, Response, NextFunction } from 'express';
import { validate, ValidationError } from 'class-validator';
import { plainToClass, ClassConstructor } from 'class-transformer';
import { BadRequestError } from '../utils/errors';

export function validateDto<T>(dtoClass: ClassConstructor<T>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoObject = plainToClass(dtoClass, req.body);
      const errors: ValidationError[] = await validate(dtoObject as object);

      if (errors.length > 0) {
        const errorMessages = errors.map((error: ValidationError) => Object.values(error?.constraints || []).join(', ')).join('; ');
        throw new BadRequestError(errorMessages);
      }

      // Validated DTO is attached to request for use in controller
      req.body = dtoObject;
      next();
    } catch (error) {
      next(error);
    }
  };
}
