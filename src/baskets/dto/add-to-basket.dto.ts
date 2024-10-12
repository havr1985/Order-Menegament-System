import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddToBasketDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  userId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;
}
