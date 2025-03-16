import { DataSource } from 'typeorm';
import { getDataSource } from './migration';
import { User, Book, Borrowing } from '../entities';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseConnection {
  private static instance: DataSource;

  public static getInstance(): DataSource {
    if (!DatabaseConnection.instance) {
      DatabaseConnection.instance = getDataSource();
    }
    return DatabaseConnection.instance;
  }

  // private create() {
  //   return new DataSource({
  //     type: 'postgres',
  //     host: process.env.POSTGRES_HOST || 'localhost',
  //     port: parseInt(process.env.POSTGRES_PORT || '5432'),
  //     username: process.env.POSTGRES_USER || 'postgres',
  //     password: process.env.POSTGRES_PASSWORD || 'postgres',
  //     database: process.env.POSTGRES_NAME || 'library_db',
  //     synchronize: process.env.NODE_ENV === 'development',
  //     logging: false, //process.env.NODE_ENV === 'development',
  //     entities: [User, Book, Borrowing],
  //     migrations: ['migrations/**/*.ts'],
  //     subscribers: ['src/subscribers/**/*.ts']
  //   });
  // }
}

export default DatabaseConnection;
