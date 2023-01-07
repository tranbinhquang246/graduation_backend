import { Injectable } from '@nestjs/common';
import { CreateCollectionImageDto } from './dto/create-collection-image.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class CollectionImagesService {
  constructor(private prisma: PrismaService) {}

  async create(
    createCollectionImageDto: CreateCollectionImageDto,
    collection: Express.Multer.File,
  ) {
    const newCollection = await this.prisma.collectionImage.create({
      data: {
        ...createCollectionImageDto,
        link: `${process.env.URL_PICTURE_COLLECTIONS}${collection.filename}`,
      },
    });
    return newCollection;
  }

  async findAll() {
    return await this.prisma.collectionImage.findMany({});
  }

  async remove(id: number) {
    const deleteCollection = await this.prisma.collectionImage.delete({
      where: { id: id },
    });
    return deleteCollection;
  }
}
