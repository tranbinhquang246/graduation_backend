import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { find } from 'rxjs';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createFavoriteDto: CreateFavoriteDto) {
    const findFavorite = await this.prisma.favorite.findMany({
      where: { userId: userId, productId: createFavoriteDto.productId },
    });
    if (findFavorite.length !== 0) {
      throw new BadRequestException(`Available`);
    }
    const newFavorite = await this.prisma.favorite.create({
      data: { userId: userId, ...createFavoriteDto },
    });
    return newFavorite;
  }

  async findFavorite(userId: string, productId: number) {
    const findFavorite = await this.prisma.favorite.count({
      where: { productId: productId, userId: userId },
    });
    return findFavorite;
  }
  async findAll(productId: number) {
    const productIdWithCount = await this.prisma.favorite.count({
      where: { productId: productId },
    });
    return productIdWithCount;
  }
  async findAllwithUserId(userId: string) {
    const findAllwithUserId = await this.prisma.favorite.findMany({
      where: { userId: userId },
      include: { product: true },
    });
    return findAllwithUserId;
  }

  async remove(productId: number, userId: string) {
    return await this.prisma.favorite.deleteMany({
      where: { productId: productId, userId: userId },
    });
  }
}
