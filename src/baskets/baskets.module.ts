import { Module } from '@nestjs/common';
import { BasketsService } from './baskets.service';
import { BasketsController } from './baskets.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Basket } from './basket.entity';
import { UsersModule } from 'src/users/users.module';
import { ProductsModule } from 'src/products/products.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Basket]),
    UsersModule,
    ProductsModule,
    OrdersModule,
  ],
  providers: [BasketsService],
  controllers: [BasketsController],
})
export class BasketsModule {}
