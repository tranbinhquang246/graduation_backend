import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Auth } from 'src/auth/auth.decorator';
import { User } from 'src/users/users.decorator';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Auth()
  @Get(':userID')
  async findAll(
    @Param('userID') userID: string,
    @Res() response,
    @User('id') id: string,
    @User('role') role: string,
  ) {
    if (id !== userID) {
      throw new BadRequestException(`Request Failed. Not have access`);
    }
    const findCart = await this.cartService.findAll(userID);
    if (!findCart) {
      throw new NotFoundException(`User not found`);
    }
    return response.status(HttpStatus.OK).send(findCart);
  }
}
