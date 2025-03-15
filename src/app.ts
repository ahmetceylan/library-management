import 'reflect-metadata';
import dotenv from 'dotenv';
import * as winston from 'winston';
import express from 'express';
import path from 'path';
import DatabaseConnection from './config/database';
import Logger from './helpers/logger';

dotenv.config({ path: path.join(__dirname, './../.env') });

DatabaseConnection.getInstance()
  .initialize()
  .catch((err) => winston.error('Error: Database Connection Error !', err));

Logger.init();
const app = express();

const port = process.env.PORT || 3001;
const server = app.listen(port, () => winston.info(`Listening on port ${port}...`));

export default server;
