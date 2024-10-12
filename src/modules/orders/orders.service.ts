import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UsersService } from 'src/modules/users/users.service';
import { ProductsService } from 'src/modules/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
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
    const user = await this.usersService.findUserById(userId);
    const product = await this.productsService.findProductById(productId);

    if (product.quantity < quantity) {
      throw new NotFoundException('Not enought quantity avaliable for product');
    }
    await this.productsService.updateQuantity(productId, -quantity);

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
      order.user = await this.usersService.findUserById(userId);
    }
    if (productId) {
      order.product = await this.productsService.findProductById(productId);
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
}
