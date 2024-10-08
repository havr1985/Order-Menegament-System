import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => CategoriesModule),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [ProductsService, TypeOrmModule],
})
export class ProductsModule {}
