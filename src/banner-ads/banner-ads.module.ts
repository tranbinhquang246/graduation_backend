import { Module } from '@nestjs/common';
import { BannerAdsService } from './banner-ads.service';
import { BannerAdsController } from './banner-ads.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [PrismaModule, MulterModule.register({ dest: './uploads' })],
  controllers: [BannerAdsController],
  providers: [BannerAdsService],
})
export class BannerAdsModule {}
