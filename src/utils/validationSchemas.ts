import Joi from 'joi';

export const userValidationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name must be at most 100 characters',
    'any.required': 'Name field is required'
  }),
  email: Joi.string().email().max(100).optional().messages({
    'string.email': 'Please enter a valid email address',
    'string.max': 'Email must be at most 100 characters',
    'any.required': 'Email field is required'
  })
});
