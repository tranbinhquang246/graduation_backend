import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpStatus,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { User } from 'src/users/users.decorator';
import { Auth } from 'src/auth/auth.decorator';

@Controller('favorite')
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Auth()
  @Post()
  async create(
    @Body() createFavoriteDto: CreateFavoriteDto,
    @User('id') userId: string,
    @Res() response,
  ) {
    try {
      const newFavorite = await this.favoriteService.create(
        userId,
        createFavoriteDto,
      );
      return response.status(HttpStatus.OK).send(newFavorite);
    } catch (error) {
      if (error.status === 409) {
        throw new ConflictException(`Available`);
      }
      throw new BadRequestException(`Request Failed`);
    }
  }

  @Auth()
  @Get('check/:productId')
  async findFavorite(
    @Param('productId') id: string,
    @User('id') userId: string,
    @Res() response,
  ) {
    try {
      const isFavorite = await this.favoriteService.findFavorite(userId, +id);
      if (isFavorite) {
        return response.status(HttpStatus.OK).send({ status: true });
      }
      return response.status(HttpStatus.OK).send({ status: false });
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }

  @Auth()
  @Get('all')
  async findAllwithUserId(@Res() response, @User('id') id: string) {
    try {
      const allAddress = await this.favoriteService.findAllwithUserId(id);
      return response.status(HttpStatus.OK).send(allAddress);
    } catch (error) {
      console.log('error');
      throw new NotFoundException(`Failed`);
    }
  }

  @Get(':productId')
  async findAll(@Param('productId') id: string, @Res() response) {
    try {
      const countFavorite = await this.favoriteService.findAll(+id);
      return response.status(HttpStatus.OK).send({ total: countFavorite });
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }

  @Auth()
  @Delete(':productId')
  async remove(
    @Param('productId') id: string,
    @User('id') userId: string,
    @Res() response,
  ) {
    try {
      const deleteFavorite = await this.favoriteService.remove(+id, userId);
      return response.status(HttpStatus.OK).send(deleteFavorite);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }
}
