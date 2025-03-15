export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Record not found') {
    super(message, 404);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Invalid request') {
    super(message, 400);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflict occurred') {
    super(message, 409);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}
