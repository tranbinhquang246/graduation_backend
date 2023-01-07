import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpStatus,
  Res,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { BannerAdsService } from './banner-ads.service';
import { CreateBannerAdDto } from './dto/create-banner-ad.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import fs = require('fs');

const multerOptions = {
  storage: diskStorage({
    destination: './uploads/bannerAds',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const fileName = `${file.originalname}-${uniqueSuffix}${ext}`;
      callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
};

@Controller('banner-ads')
export class BannerAdsController {
  constructor(private readonly bannerAdsService: BannerAdsService) {}

  @Auth(Role.Admin)
  @Post()
  @UseInterceptors(FileInterceptor('banner', multerOptions))
  async create(
    @Body() createBannerAdDto: CreateBannerAdDto,
    @UploadedFile() banner: Express.Multer.File,
    @Res() response,
  ) {
    try {
      const newBanner = await this.bannerAdsService.create(
        JSON.parse(JSON.stringify(createBannerAdDto)),
        banner,
      );
      return response.status(HttpStatus.OK).send(newBanner);
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException(`No product found`);
      }
      if (!banner) {
        throw new BadRequestException(`Missing main image`);
      }
      throw new BadRequestException(`Request Failed`);
    }
  }

  @Get()
  async findAll(@Res() response) {
    try {
      const bannerAds = await this.bannerAdsService.findAll();
      return response.status(HttpStatus.OK).send(bannerAds);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }
  @Auth(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
    try {
      const deletedProduct = await this.bannerAdsService.remove(+id);
      const linkRemove = deletedProduct.link;
      fs.unlinkSync(`uploads/${linkRemove.slice(22)}`);
      return response.status(HttpStatus.OK).send(deletedProduct);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(error.meta.cause);
      }
      if (error.code === 'ENOENT') {
        return response.status(HttpStatus.OK).send({ message: 'Success' });
      }
      throw new BadRequestException('Request Failed');
    }
  }
}
