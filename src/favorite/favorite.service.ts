import { ConflictException, Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createFavoriteDto: CreateFavoriteDto) {
    const findFavorite = await this.prisma.favorite.findMany({
      where: { userId: userId, productId: createFavoriteDto.productId },
    });
    if (findFavorite.length !== 0) {
      throw new ConflictException(`Available`);
    }
    const newFavorite = await this.prisma.favorite.create({
      data: { userId: userId, ...createFavoriteDto },
    });
    return newFavorite;
  }

  async findAll(productId: number) {
    const productIdWithCount = await this.prisma.favorite.count({
      where: { productId: productId },
    });
    return productIdWithCount;
  }

  async remove(productId: number, userId: string) {
    return await this.prisma.favorite.deleteMany({
      where: { productId: productId, userId: userId },
    });
  }
}
