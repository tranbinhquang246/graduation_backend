import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SubImageService {
  constructor(private prisma: PrismaService) {}

  async create(subImgs: Array<Express.Multer.File>, productId: number) {
    const data = [];
    for (let index = 0; index < subImgs.length; index++) {
      data.push({
        productId: productId,
        link: `${process.env.URL_PICTURE_SUBIMAGE}${subImgs[index].filename}`,
      });
    }
    const createSubImages = await this.prisma.subImage.createMany({
      data: data,
    });
    return createSubImages;
  }

  async remove(id: number) {
    return await this.prisma.subImage.delete({ where: { id: id } });
  }
}
