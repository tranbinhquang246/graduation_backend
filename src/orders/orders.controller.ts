import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { User } from 'src/users/users.decorator';
import { Auth } from 'src/auth/auth.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Auth()
  @Post()
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @User('id') userId: string,
    @Res() response,
  ) {
    try {
      const newOrder = await this.ordersService.create(userId, createOrderDto);
      return response.status(HttpStatus.OK).send(newOrder);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }

  @Auth()
  @Get()
  async findAll(@User('id') userId: string, @Res() response) {
    const order = await this.ordersService.findAll(userId);
    return response.status(HttpStatus.OK).send(order);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(+id);
  }
}
