import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Order, User, Product])],
  providers: [OrdersService],
  controllers: [OrdersController],
})
export class OrdersModule {}
