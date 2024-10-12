import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { CategoriesService } from 'src/categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAllProducts(
    page: number,
    limit: number,
  ): Promise<{ data: Product[]; total: number }> {
    const [data, total] = await this.productsRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }

  async findProductById(id: number): Promise<Product> {
    const product = await this.productsRepository.findOneBy({ id });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { categoryId, ...productData } = createProductDto;
    const category = await this.categoriesService.findCategoryById(categoryId);
    const product = this.productsRepository.create({
      ...productData,
      category,
    });
    return this.productsRepository.save(product);
  }

  async updateProduct(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const product = await this.findProductById(id);
    const updatedProduct = { ...product, ...updateProductDto };
    return this.productsRepository.save(updatedProduct);
  }

  async deleteProduct(id: number): Promise<void> {
    const product = await this.findProductById(id);
    await this.productsRepository.remove(product);
  }

  async updateQuantity(
    productId: number,
    quantityChange: number,
  ): Promise<Product> {
    const product = await this.findProductById(productId);
    if (product.quantity + quantityChange < 0) {
      throw new Error('Not enough quantity avaliable')
    }
    product.quantity += quantityChange;
    return this.productsRepository.save(product);
  }
}
