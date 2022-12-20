import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { SubImageService } from './sub-image.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Auth } from 'src/auth/auth.decorator';
import { FilesInterceptor } from '@nestjs/platform-express';

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

  //   @Auth()
  @Post()
  @UseInterceptors(FilesInterceptor('subImgs[]', 10, multerOptions))
  create(
    @UploadedFiles() subImgs: Array<Express.Multer.File>,
    @Res() response,
  ) {
    console.log(subImgs);
    return response.status(HttpStatus.OK).send('Hello');

    // return this.subImageService.create(createSubImageDto);
  }

  @Get()
  findAll() {
    return this.subImageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subImageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string) {
    return this.subImageService.update(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subImageService.remove(+id);
  }
}

//Link save multidata prima: https://www.prisma.io/docs/concepts/components/prisma-client/crud#create-multiple-records
//save iamge with link: http://localhost:5000///subImages//stike.jpg-1671556686370-77222672.jpg
