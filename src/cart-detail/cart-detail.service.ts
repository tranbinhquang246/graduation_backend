import { Injectable } from '@nestjs/common';
import { CreateCartDetailDto } from './dto/create-cart-detail.dto';
import { UpdateCartDetailDto } from './dto/update-cart-detail.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartDetailService {
  constructor(private prisma: PrismaService) {}

  async create(createCartDetailDto: CreateCartDetailDto) {
    const newCartDetail = await this.prisma.cartDetail.create({
      data: createCartDetailDto,
    });
    return newCartDetail;
  }

  async count(cartId: number) {
    const findOne = await this.prisma.cartDetail.findMany({
      where: {
        cartId: cartId,
      },
    });
    return findOne;
  }

  async update(id: number, updateCartDetailDto: UpdateCartDetailDto) {
    const updateCartDetail = await this.prisma.cartDetail.update({
      where: {
        id: id,
      },
      data: updateCartDetailDto,
    });
    return updateCartDetail;
  }

  async remove(id: number) {
    const removeCartDetail = await this.prisma.cartDetail.delete({
      where: { id: id },
    });
    return removeCartDetail;
  }
}
