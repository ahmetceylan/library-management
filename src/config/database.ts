import { DataSource } from 'typeorm';
import { User, Book, Borrowing } from '../entities';
import dotenv from 'dotenv';

dotenv.config();

class DatabaseConnection {
  constructor() {}
  private static _instance: DataSource;
  public static getInstance(): DataSource {
    return this._instance || (this._instance = new this().create());
  }

  private create() {
    return new DataSource({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_NAME || 'library_management',
      synchronize: process.env.NODE_ENV === 'development', // Sadece geliştirme ortamında true olmalı
      logging: process.env.NODE_ENV === 'development',
      entities: [User, Book, Borrowing],
      migrations: ['src/migrations/**/*.ts'],
      subscribers: ['src/subscribers/**/*.ts']
    });
  }
}
export default DatabaseConnection;
