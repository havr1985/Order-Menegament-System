import { Category } from 'src/categories/category.entity';
import { Order } from 'src/orders/order.entity';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Basket } from 'src/baskets/basket.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Product, User, Order, Category, Basket],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  logging: true,
});
