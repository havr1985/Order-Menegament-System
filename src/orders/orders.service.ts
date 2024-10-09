import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/user.entity';
import { Product } from 'src/products/product.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  findAllOrders(): Promise<Order[]> {
    return this.ordersRepository.find({ relations: ['user', 'product'] });
  }

  async findOrderById(id: number): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['user', 'product'],
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { userId, productId, quantity } = createOrderDto;
    const user = await this.getUserOrThrow(userId);
    const product = await this.getProductOrThrow(productId);

    const order = this.ordersRepository.create({
      user,
      product,
      quantity,
      createdData: new Date().toISOString(),
      status: createOrderDto.status,
    });
    return this.ordersRepository.save(order);
  }

  async updateOrder(
    id: number,
    updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    const order = await this.findOrderById(id);
    const { userId, productId, quantity, status } = updateOrderDto;
    if (userId) {
      order.user = await this.getUserOrThrow(userId);
    }
    if (productId) {
      order.product = await this.getProductOrThrow(productId);
    }
    if (quantity) {
      order.quantity = quantity;
    }
    if (status) {
      order.status = status;
    }
    return this.ordersRepository.save(order);
  }

  async deleteOrder(id: number): Promise<void> {
    const order = await this.findOrderById(id);
    await this.ordersRepository.remove(order);
  }

  private async getUserOrThrow(userId: number): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
  private async getProductOrThrow(productId: number): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
