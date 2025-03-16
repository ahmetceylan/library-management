import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Book } from '../entities/Book';
import { Borrowing } from '../entities/Borrowing';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT || '5432'),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_NAME,
  entities: [User, Book, Borrowing],
  migrations: ['migrations/*.ts'],
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  migrationsTableName: 'migrations'
});

// TODO return according to environment: node_env
export const getDataSource = () => {
  return AppDataSource;
};
