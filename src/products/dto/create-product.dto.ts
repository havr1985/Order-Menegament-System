import { ApiProperty } from '@nestjs/swagger';
import {
  IsDecimal,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Laptop', description: 'The name of the product' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 999.99, description: 'The price of the product' })
  @IsDecimal()
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    example: 100,
    description: 'The quantity of the product in stock',
  })
  @IsNumber()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty({ example: 1, description: 'ID of the category' })
  @IsInt()
  @IsNotEmpty()
  categoryId: number;
}
