import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  HttpStatus,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { SubImageService } from './sub-image.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Auth } from 'src/auth/auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Role } from 'src/auth/roles/role.enum';
import fs = require('fs');

const multerOptions = {
  storage: diskStorage({
    destination: './uploads/subImages',
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

@Controller('sub-image')
export class SubImageController {
  constructor(private readonly subImageService: SubImageService) {}

  @Auth(Role.Admin)
  @Post()
  @UseInterceptors(FilesInterceptor('subImgs[]', 10, multerOptions))
  async create(
    @UploadedFiles() subImgs: Array<Express.Multer.File>,
    @Body() productId: number,
    @Res() response,
  ) {
    try {
      const createSubImgs = await this.subImageService.create(
        subImgs,
        +productId['productId'],
      );
      return response.status(HttpStatus.OK).send({ data: createSubImgs });
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException(`No product found`);
      }
      throw new BadRequestException(`Request Failed`);
    }
  }
  @Auth(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
    try {
      const removeSubImage = await this.subImageService.remove(+id);
      const linkRemove = removeSubImage.link;
      fs.unlinkSync(`uploads/${linkRemove.slice(22)}`);
      return removeSubImage;
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

//Link save multidata prima: https://www.prisma.io/docs/concepts/components/prisma-client/crud#create-multiple-records
//save iamge with link: http://localhost:5000///subImages//stike.jpg-1671556686370-77222672.jpg
