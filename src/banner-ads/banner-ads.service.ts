import { Injectable } from '@nestjs/common';
import { CreateBannerAdDto } from './dto/create-banner-ad.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BannerAdsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createBannerAdDto: CreateBannerAdDto,
    banner: Express.Multer.File,
  ) {
    const newBanner = await this.prisma.bannerAds.create({
      data: {
        ...createBannerAdDto,
        link: `${process.env.URL_PICTURE_BANNERADS}${banner.filename}`,
      },
    });
    return newBanner;
  }

  async findAll() {
    return await this.prisma.bannerAds.findMany({});
  }

  async remove(id: number) {
    const deleteBanner = await this.prisma.bannerAds.delete({
      where: { id: id },
    });
    return deleteBanner;
  }
}
