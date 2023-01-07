import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  Res,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { CollectionImagesService } from './collection-images.service';
import { CreateCollectionImageDto } from './dto/create-collection-image.dto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import fs = require('fs');

const multerOptions = {
  storage: diskStorage({
    destination: './uploads/collections',
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

@Controller('collection-images')
export class CollectionImagesController {
  constructor(
    private readonly collectionImagesService: CollectionImagesService,
  ) {}

  @Auth(Role.Admin)
  @Post()
  @UseInterceptors(FileInterceptor('collection', multerOptions))
  async create(
    @Body() createCollectionImageDto: CreateCollectionImageDto,
    @UploadedFile() collection: Express.Multer.File,
    @Res() response,
  ) {
    try {
      const newCollection = await this.collectionImagesService.create(
        JSON.parse(JSON.stringify(createCollectionImageDto)),
        collection,
      );
      return response.status(HttpStatus.OK).send(newCollection);
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException(`No product found`);
      }
      if (!collection) {
        throw new BadRequestException(`Missing main image`);
      }
      throw new BadRequestException(`Request Failed`);
    }
  }

  @Get()
  async findAll(@Res() response) {
    try {
      const bannerAds = await this.collectionImagesService.findAll();
      return response.status(HttpStatus.OK).send(bannerAds);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }

  @Auth(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
    try {
      const deletedProduct = await this.collectionImagesService.remove(+id);
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
