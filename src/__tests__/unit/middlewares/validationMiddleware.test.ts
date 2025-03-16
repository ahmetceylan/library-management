import { validateDto } from '../../../middlewares/validationMiddleware';
import { IsNotEmpty, IsString } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { BadRequestError } from '../../../utils/errors';

class TestDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}

describe('Validation Middleware', () => {
  let mockRequest: any;
  let mockResponse: any;
  let mockNext: jest.Mock;

  beforeEach(() => {
    mockRequest = {
      body: {}
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  it('should pass validation for valid data', async () => {
    mockRequest.body = { name: 'Test Name' };
    const middleware = validateDto(TestDto);

    await middleware(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith();
    expect(mockRequest.body).toBeInstanceOf(TestDto);
    expect(mockRequest.body.name).toBe('Test Name');
  });

  it('should call next with BadRequestError for invalid data', async () => {
    mockRequest.body = {};
    const middleware = validateDto(TestDto);

    await middleware(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
  });

  it('should handle validation errors correctly', async () => {
    mockRequest.body = { name: 123 }; // name should be string
    const middleware = validateDto(TestDto);

    await middleware(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
    const error = mockNext.mock.calls[0][0];
    expect(error.message).toContain('name must be a string');
  });
});
