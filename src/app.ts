import 'reflect-metadata';
import dotenv from 'dotenv';
import * as winston from 'winston';
import express from 'express';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import rateLimit from 'express-rate-limit';
import DatabaseConnection from './config/database';
import Logger from './helpers/logger';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';
import { requestLoggerMiddleware } from './middlewares/requestLoggerMiddleware';

dotenv.config({ path: path.join(__dirname, './../.env') });

DatabaseConnection.getInstance()
  .initialize()
  .catch((err) => winston.error('Error: Database Connection Error !', err));

Logger.init();
const app = express();

// Add request logger middleware before other middlewares
app.use(requestLoggerMiddleware);

// Middlewares
// Rate Limiter
// Enable if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
// see https://expressjs.com/en/guide/behind-proxies.html
// app.set('trust proxy', 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use(limiter);
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use(routes);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true
    }
  })
);

// 404 handle
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found', status: 404 });
});

// Error handler
app.use(errorHandler);

const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

export default server;
