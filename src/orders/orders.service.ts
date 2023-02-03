import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CartDetailService } from 'src/cart-detail/cart-detail.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private cartService: CartDetailService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const newOrder = await this.prisma.order.create({
      data: {
        userId: userId,
        totalOrder: createOrderDto.totalOrder,
        statusOrder: 'waiting',
        deliveryAddress: createOrderDto.deliveryAddress,
      },
    });
    const makeDataOrderDetail = createOrderDto.products.map((item) => {
      return { ...item, orderId: newOrder.id };
    });
    await this.prisma.orderDetail.createMany({
      data: makeDataOrderDetail,
    });
    await this.cartService.removeAll(createOrderDto.cartId);
    return newOrder;
  }

  async findAll(userId: string) {
    const findAll = await this.prisma.order.findMany({
      where: {
        userId: userId,
      },
      include: {
        orderDetail: {
          include: {
            product: true,
          },
        },
      },
    });
    return findAll;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const updateOrder = await this.prisma.order.update({
      where: { id: id },
      data: {
        statusOrder: updateOrderDto.statusOrder,
      },
    });
    return updateOrder;
  }

  async remove(id: number) {
    const deleteOrder = await this.prisma.order.delete({
      where: { id: id },
    });
    return deleteOrder;
  }
}
