import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Product } from 'src/products/product.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  findAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async findCategoryById(id: number): Promise<Category> {
    const category = await this.categoriesRepository.findOneBy({ id });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async findCategoryByIdWithProducts(
    id: number,
    page: number,
    limit: number,
  ): Promise<Category> {
    const skip = (page - 1) * limit;
    const category = await this.findCategoryById(id)
    const products = await this.productsRepository.find({
      where: { category: { id } },
      skip,
      take: limit,
    });
    return { ...category, products };
  }

  createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const newCategory = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(newCategory);
  }

  async updateCategory(
    id: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findCategoryById(id);
    const updatedCategory = { ...category, ...updateCategoryDto };
    return this.categoriesRepository.save(updatedCategory);
  }

  async deleteCategory(id: number): Promise<void> {
    const category = await this.findCategoryById(id);
    await this.categoriesRepository.remove(category);
  }
}
