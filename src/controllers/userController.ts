import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { getPaginationOptions } from '../utils/pagination';
import { CreateUserDto } from '../dtos/user/createUserDto';
import { plainToClass } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { BadRequestError } from '../utils/errors';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const paginationOptions = getPaginationOptions(req);
      const result = await this.userService.getAllUsers(paginationOptions);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      const user = await this.userService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };
}
