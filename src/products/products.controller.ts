import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  NotFoundException,
  HttpStatus,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import fs = require('fs');

const multerOptions = {
  storage: diskStorage({
    destination: './uploads/mainImages',
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

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Auth(Role.Admin)
  @Post()
  @UseInterceptors(FileInterceptor('mainImg', multerOptions))
  async create(
    @UploadedFile() mainImg: Express.Multer.File,
    @Body() createProductDto: CreateProductDto,
    @Res() response,
  ) {
    try {
      const newProdutct = await this.productsService.create(
        JSON.parse(JSON.stringify(createProductDto)),
        mainImg,
      );
      return response.status(HttpStatus.OK).send(newProdutct);
    } catch (error) {
      if (error.code === 'P2003') {
        throw new BadRequestException(`No product found`);
      }
      if (!mainImg) {
        throw new BadRequestException(`Missing main image`);
      }
      throw new BadRequestException(`Request Failed`);
    }
  }

  @Get('all')
  async findAll(@Res() response) {
    try {
      const findAll = await this.productsService.findAll();
      return response.status(HttpStatus.OK).send(findAll);
    } catch (error) {
      throw new NotFoundException(`No product found`);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response) {
    try {
      const findProduct = await this.productsService.findOne(+id);
      return response.status(HttpStatus.OK).send(findProduct);
    } catch (error) {
      throw new NotFoundException(`Product not found`);
    }
  }

  @Auth(Role.Admin)
  @Patch('edit/:id')
  @UseInterceptors(FileInterceptor('mainImg', multerOptions))
  async update(
    @UploadedFile() mainImg: Express.Multer.File,
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Res() response,
  ) {
    try {
      const editedProduct = await this.productsService.update(
        +id,
        JSON.parse(JSON.stringify(updateProductDto)),
        mainImg,
      );
      return response.status(HttpStatus.OK).send(editedProduct);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }

  @Auth(Role.Admin)
  @Delete(':id')
  async remove(@Param('id') id: string, @Res() response) {
    try {
      const deletedProduct = await this.productsService.remove(+id);
      const linkRemove = deletedProduct.mainImg;
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
