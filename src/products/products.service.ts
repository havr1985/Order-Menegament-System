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

  findAllProducts(page: number, limit: number): Promise<Product[]> {
    const skip = (page - 1) * limit;
    return this.productsRepository.find({ skip, take: limit });
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
}
