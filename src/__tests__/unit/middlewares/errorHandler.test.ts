import { errorHandler } from '../../../middlewares/errorHandler';
import { NotFoundError, BadRequestError, ConflictError } from '../../../utils/errors';
import * as winston from 'winston';

// Mock winston
jest.mock('winston', () => ({
  error: jest.fn()
}));

describe('Error Handler Middleware', () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();

    (winston.error as jest.Mock).mockClear();
  });

  it('should handle NotFoundError correctly', () => {
    const error = new NotFoundError('Resource not found');

    errorHandler(error, mockRequest, mockResponse, mockNext);

    expect(winston.error).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Resource not found'
    });
  });

  it('should handle BadRequestError correctly', () => {
    const error = new BadRequestError('Invalid request data');

    errorHandler(error, mockRequest, mockResponse, mockNext);

    expect(winston.error).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Invalid request data'
    });
  });

  it('should handle ConflictError correctly', () => {
    const error = new ConflictError('Resource already exists');

    errorHandler(error, mockRequest, mockResponse, mockNext);

    expect(winston.error).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(409);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Resource already exists'
    });
  });

  it('should handle QueryFailedError correctly', () => {
    const error = new Error('Database error');
    error.name = 'QueryFailedError';

    errorHandler(error, mockRequest, mockResponse, mockNext);

    expect(winston.error).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Database operation failed'
    });
  });

  it('should handle generic errors correctly', () => {
    const error = new Error('Unknown error');

    errorHandler(error, mockRequest, mockResponse, mockNext);

    expect(winston.error).toHaveBeenCalled();
    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Server error'
    });
  });
});
