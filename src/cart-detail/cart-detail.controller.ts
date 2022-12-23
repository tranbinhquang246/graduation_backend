import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { CartDetailService } from './cart-detail.service';
import { CreateCartDetailDto } from './dto/create-cart-detail.dto';
import { UpdateCartDetailDto } from './dto/update-cart-detail.dto';
import { User } from 'src/users/users.decorator';
import { PrismaService } from 'src/prisma/prisma.service';
import { Auth } from 'src/auth/auth.decorator';

@Controller('cart-detail')
export class CartDetailController {
  constructor(
    private readonly cartDetailService: CartDetailService,
    private prisma: PrismaService,
  ) {}

  @Auth()
  @Post()
  async create(
    @Body() createCartDetailDto: CreateCartDetailDto,
    @Res() response,
    @User('id') id: string,
  ) {
    try {
      const getUserId = await this.prisma.cart.findUnique({
        where: {
          id: createCartDetailDto.cartId,
        },
      });

      if (getUserId.userId !== id) {
        throw new BadRequestException(`Request Failed`);
      }
      const checkExitsOrderDetail = await this.prisma.cartDetail.findFirst({
        where: {
          AND: [
            { cartId: createCartDetailDto.cartId },
            { productId: createCartDetailDto.productId },
          ],
        },
      });
      if (checkExitsOrderDetail) {
        createCartDetailDto.quantity =
          createCartDetailDto.quantity + checkExitsOrderDetail.quantity;
        const editedCartDetail = await this.cartDetailService.update(
          checkExitsOrderDetail.id,
          { quantity: createCartDetailDto.quantity },
        );

        if (!editedCartDetail) {
          throw new BadRequestException(`Request Failed`);
        }
        return response.status(HttpStatus.OK).send(editedCartDetail);
      }
      const newCartDetail = await this.cartDetailService.create(
        createCartDetailDto,
      );
      if (!newCartDetail) {
        throw new BadRequestException(`Request Failed`);
      }
      return response.status(HttpStatus.OK).send(newCartDetail);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }
  //   @Auth()
  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.cartDetailService.findOne(+id);
  //   }
  @Auth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCartDetailDto: UpdateCartDetailDto,
    @Res() response,
    @User('id') userId: string,
  ) {
    try {
      const findUser = await this.prisma.cartDetail.findUnique({
        where: { id: +id },
        include: {
          cart: true,
        },
      });

      if (findUser.cart.userId !== userId) {
        throw new BadRequestException(`Request Failed`);
      }
      const editedCartDetail = await this.cartDetailService.update(
        +id,
        updateCartDetailDto,
      );

      if (!editedCartDetail) {
        throw new BadRequestException(`Request Failed`);
      }
      return response.status(HttpStatus.OK).send(editedCartDetail);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }
  @Auth()
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @User('id') userId: string,
    @Res() response,
  ) {
    try {
      const findUser = await this.prisma.cartDetail.findUnique({
        where: { id: +id },
        include: {
          cart: true,
        },
      });

      if (findUser.cart.userId !== userId) {
        throw new BadRequestException(`Request Failed`);
      }
      const deleteCartDetail = await this.cartDetailService.remove(+id);

      if (!deleteCartDetail) {
        throw new BadRequestException(`Request Failed`);
      }
      return response.status(HttpStatus.OK).send(deleteCartDetail);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }
}
