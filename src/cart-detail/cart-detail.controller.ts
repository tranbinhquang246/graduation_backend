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
import { ProductsService } from 'src/products/products.service';

@Controller('cart-detail')
export class CartDetailController {
  constructor(
    private readonly cartDetailService: CartDetailService,
    private prisma: PrismaService,
    private pproductsService: ProductsService,
  ) {}

  async getQuantityProduct(id: number) {
    try {
      const quantityProducts = await this.pproductsService.findOne(id);
      return quantityProducts.quantity;
    } catch (error) {
      throw new Error('Can not get quantity product');
    }
  }
  @Auth()
  @Post()
  async create(
    @Body() createCartDetailDto: CreateCartDetailDto,
    @Res() response,
    @User('id') id: string,
  ) {
    const quantityProductRemaining = await this.getQuantityProduct(
      createCartDetailDto.productId,
    );
    if (quantityProductRemaining < createCartDetailDto.quantity) {
      throw new BadRequestException('Not enough quantity');
    }
    try {
      const getUserId = await this.prisma.cart.findUnique({
        where: {
          id: createCartDetailDto.cartId,
        },
      });

      if (getUserId.userId !== id) {
        throw new BadRequestException(`Not have access`);
      }
      const updateQuantityProduct = await this.pproductsService.updateQuantity(
        createCartDetailDto.productId,
        quantityProductRemaining - createCartDetailDto.quantity,
      );
      if (!updateQuantityProduct) {
        throw new Error('Error updating product quantity');
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
  @Auth()
  @Get(':cartId')
  findOne(@Param('cartId') cartId: string) {
    return this.cartDetailService.count(+cartId);
  }
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
        throw new BadRequestException(`Not have access`);
      }
      const quantityProductRemaining = await this.getQuantityProduct(
        findUser.productId,
      );
      if (
        Math.abs(updateCartDetailDto.quantity - findUser.quantity) >
        quantityProductRemaining
      ) {
        throw new BadRequestException('Not enough quantity');
      }
      const updateQuantityProduct = await this.pproductsService.updateQuantity(
        findUser.productId,
        quantityProductRemaining -
          (updateCartDetailDto.quantity - findUser.quantity),
      );
      if (!updateQuantityProduct) {
        throw new Error('Error updating product quantity');
      }
      const editedCartDetail = await this.cartDetailService.update(
        +id,
        updateCartDetailDto,
      );

      if (!editedCartDetail) {
        await this.pproductsService.updateQuantity(
          findUser.productId,
          quantityProductRemaining,
        );
        throw new BadRequestException(`Request Failed`);
      }
      return response.status(HttpStatus.OK).send(editedCartDetail);
    } catch (error) {
      if (error.message === 'Not enough quantity') {
        throw new BadRequestException('Not enough quantity');
      }
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
      const quantityProductRemaining = await this.getQuantityProduct(
        findUser.productId,
      );
      await this.pproductsService.updateQuantity(
        deleteCartDetail.productId,
        deleteCartDetail.quantity + quantityProductRemaining,
      );
      return response.status(HttpStatus.OK).send(deleteCartDetail);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }
}
