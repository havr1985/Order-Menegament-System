import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'src/shared/enums';

export class CreateOrderDto {
  @ApiProperty({
    example: 1,
    description: 'The ID of the user placing the order',
  })
  userId: number;

  @ApiProperty({
    example: 1,
    description: 'The ID of the product being ordered',
  })
  productId: number;

  @ApiProperty({
    example: 2,
    description: 'The quantity of the product ordered',
  })
  quantity: number;

  @ApiProperty({
    example: 'Pending',
    description: 'The initial status of the order',
    enum: OrderStatus,
  })
  status?: OrderStatus;
}
