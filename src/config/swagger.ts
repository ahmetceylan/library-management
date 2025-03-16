import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Library Management API',
    version,
    description: 'RESTful API doc for library management'
  },
  servers: [
    {
      url: '/',
      description: 'API Server'
    }
  ],
  components: {
    securitySchemes: {},
    schemas: {
      User: {
        type: 'object',
        required: ['name'],
        properties: {
          id: {
            type: 'integer',
            description: 'User ID'
          },
          name: {
            type: 'string',
            description: 'User name'
          },
          email: {
            type: 'string',
            description: 'User email address(optional)',
            format: 'email'
          },
          created_at: {
            type: 'string',
            format: 'date-time'
          },
          updated_at: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Book: {
        type: 'object',
        required: ['name'],
        properties: {
          id: {
            type: 'integer',
            description: 'Book ID'
          },
          name: {
            type: 'string',
            description: 'Book name'
          },
          created_at: {
            type: 'string',
            format: 'date-time'
          },
          updated_at: {
            type: 'string',
            format: 'date-time'
          }
        }
      },
      Borrowing: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'Record ID'
          },
          user_id: {
            type: 'integer',
            description: 'User ID'
          },
          book_id: {
            type: 'integer',
            description: 'Book ID'
          },
          borrow_date: {
            type: 'string',
            format: 'date-time',
            description: 'Borrow date'
          },
          return_date: {
            type: 'string',
            format: 'date-time',
            description: 'Return date'
          },
          score: {
            type: 'integer',
            minimum: 0,
            description: 'Book score'
          }
        }
      },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string'
          },
          status: {
            type: 'integer'
          }
        }
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts', './src/controllers/*.ts']
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
