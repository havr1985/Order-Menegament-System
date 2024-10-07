import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get all products' })
  @Get()
  findAllProducts(): Promise<Product[]> {
    return this.productsService.findAllProducts();
  }

  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @Get(':id')
  findProductById(@Param('id') id: number): Promise<Product> {
    return this.productsService.findProductById(id);
  }

  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Create new product' })
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return this.productsService.createProduct(createProductDto);
  }

  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @Put(':id')
  updateProduct(
    @Param('id') id: number,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    return this.productsService.updateProduct(id, updateProductDto);
  }

  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiParam({ name: 'id', type: 'number' })
  @Delete(':id')
  deleteProduct(@Param('id') id: number): Promise<void> {
    return this.productsService.deleteProduct(id);
  }
}
