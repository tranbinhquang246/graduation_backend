import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}
  async findAll(id: string) {
    const findCart = await this.prisma.cart.findMany({
      where: {
        userId: id,
      },
      include: {
        cartDetail: {
          include: {
            product: true,
          },
        },
      },
    });
    return findCart;
  }
}
