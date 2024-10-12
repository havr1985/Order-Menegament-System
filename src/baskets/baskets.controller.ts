import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { BasketsService } from './baskets.service';
import { Basket } from './basket.entity';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AddToBasketDto } from './dto/add-to-basket.dto';

@ApiTags('Basket')
@Controller('baskets')
export class BasketsController {
  constructor(private readonly basketsService: BasketsService) {}
  @ApiOperation({ summary: 'Get basket items by user ID' })
  @Get(':userId')
  findBasketByUserId(@Param('userId') userId: number): Promise<Basket[]> {
    return this.basketsService.findBasketByUserId(userId);
  }

  @ApiOperation({ summary: 'Add item to basket' })
  @Post()
  addToBasket(@Body() addToBasketDto: AddToBasketDto): Promise<Basket> {
    return this.basketsService.addToBasket(addToBasketDto);
  }

  @ApiOperation({ summary: 'Remove item from basket' })
  @Delete(':userId/:productId')
  removeFromBasket(
    @Param('userId') userId: number,
    @Param('productId') productId: number,
  ): Promise<void> {
    return this.removeFromBasket(userId, productId);
  }

  @ApiOperation({ summary: 'Clear basket for user' })
  @Delete('clear/:userId')
  clearBasket(@Param('userId') userId: number): Promise<void> {
    return this.basketsService.clearBasket(userId);
  }

  @Post('checkout/:userId')
  createOrderFromBasket(@Param('userId') userId: number): Promise<void> {
    return this.basketsService.createOrderFromBasket(userId);
  }
}
