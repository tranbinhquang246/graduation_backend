import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  NotFoundException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Auth(Role.Admin)
  @Post()
  async create(@Body() createProductDto: CreateProductDto, @Res() response) {
    const newProdutct = await this.productsService.create(createProductDto);
    if (!newProdutct) {
      throw new BadRequestException(`Request Failed`);
    }
    return response.status(HttpStatus.OK).send(newProdutct);
  }

  @Get('all')
  async findAll(@Res() response) {
    const findAll = await this.productsService.findAll();
    if (!findAll) {
      throw new NotFoundException(`No product found`);
    }

    return response.status(HttpStatus.OK).send(findAll);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response) {
    const findProduct = await this.productsService.findOne(+id);
    if (!findProduct) {
      throw new NotFoundException(`Product not found`);
    }
    return response.status(HttpStatus.OK).send(findProduct);
  }

  @Auth(Role.Admin)
  @Patch('edit/:id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Res() response,
  ) {
    try {
      const editedProduct = await this.productsService.update(
        +id,
        updateProductDto,
      );
      return response.status(HttpStatus.OK).send(editedProduct);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }

  @Auth(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
    try {
      const deletedProduct = await this.productsService.remove(+id);
      return response.status(HttpStatus.OK).send(deletedProduct);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }
}
