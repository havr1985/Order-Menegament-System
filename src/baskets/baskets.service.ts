import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Basket } from './basket.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ProductsService } from 'src/products/products.service';
import { AddToBasketDto } from './dto/add-to-basket.dto';
import { OrdersService } from 'src/orders/orders.service';
import { OrderStatus } from 'src/shared/enums';

@Injectable()
export class BasketsService {
  constructor(
    @InjectRepository(Basket)
    private readonly basketsRepository: Repository<Basket>,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
    private readonly ordersService: OrdersService,
  ) {}

  async findBasketByUserId(userId: number): Promise<Basket[]> {
    return this.basketsRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  async addToBasket(addToBaskerDto: AddToBasketDto): Promise<Basket> {
    const { userId, productId, quantity } = addToBaskerDto;
    const user = await this.usersService.findUserById(userId);
    const product = await this.productsService.findProductById(productId);

    if (product.quantity < quantity) {
      throw new NotFoundException('Not enogh quantity avaliable for product');
    }
    let basketItem = await this.basketsRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (basketItem) {
      basketItem.quantity += quantity;
    } else {
      basketItem = this.basketsRepository.create({ user, product, quantity });
    }
    await this.productsService.updateQuantity(productId, -quantity);
    return this.basketsRepository.save(basketItem);
  }

  async removeFromBasket(userId: number, productId: number): Promise<void> {
    let basketItem = await this.basketsRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (!basketItem) {
      throw new NotFoundException('Item not found in basket');
    }
    await this.productsService.updateQuantity(productId, basketItem.quantity);
    await this.basketsRepository.remove(basketItem);
  }

  async clearBasket(userId: number): Promise<void> {
    const basketItem = await this.findBasketByUserId(userId);
    for (const item of basketItem) {
      await this.productsService.updateQuantity(item.product.id, item.quantity);
      await this.basketsRepository.remove(item);
    }
  }

  async createOrderFromBasket(userId: number): Promise<void> {
    const basketItem = await this.findBasketByUserId(userId);
    if (basketItem.length === 0) {
      throw new NotFoundException('Basket is empty');
    }
    for (const item of basketItem) {
      await this.ordersService.createOrder({
        userId: item.user.id,
        productId: item.product.id,
        quantity: item.quantity,
        status: OrderStatus.PENDING,
      });
      await this.basketsRepository.remove(item);
    }
  }
}
