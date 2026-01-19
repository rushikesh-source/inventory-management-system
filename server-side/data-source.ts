import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './src/users/entities/user.entity';
import { Product } from './src/products/entities/product.entity';
import { Inventory } from './src/inventory/entities/inventory.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [User, Product, Inventory],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
