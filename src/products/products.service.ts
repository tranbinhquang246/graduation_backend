import { BadRequestException, Injectable } from '@nestjs/common';
import { Products } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createProductDto: CreateProductDto,
    mainImg: Express.Multer.File,
  ) {
    createProductDto.quantity = +createProductDto.quantity;
    createProductDto.price = +createProductDto.price;
    createProductDto.salePrice = +createProductDto.salePrice;

    const newProducts = await this.prisma.products.create({
      data: {
        ...createProductDto,
        mainImg: `${process.env.URL_PICTURE_MAINIMAGE}${mainImg.filename}`,
      },
    });
    return newProducts;
  }

  async findAll(): Promise<Products[]> {
    const findAll = await this.prisma.products.findMany({
      include: { subImg: true },
    });
    return findAll;
  }

  async findOne(id: number): Promise<Products> {
    const findProduct = await this.prisma.products.findUnique({
      where: { id: id },
      include: { subImg: true },
    });
    return findProduct;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
    mainImg: Express.Multer.File,
  ): Promise<Products> {
    updateProductDto.quantity = +updateProductDto.quantity;
    updateProductDto.price = +updateProductDto.price;
    updateProductDto.salePrice = +updateProductDto.salePrice;
    if (mainImg) {
      const updateProduct = await this.prisma.products.update({
        where: { id: id },
        data: {
          ...updateProductDto,
          mainImg: `${process.env.URL_PICTURE_MAINIMAGE}${mainImg.filename}`,
        },
      });
      return updateProduct;
    }
    const updateProduct = await this.prisma.products.update({
      where: { id: id },
      data: updateProductDto,
    });
    return updateProduct;
  }

  async remove(id: number) {
    const deleteProduct = await this.prisma.products.delete({
      where: { id: id },
    });
    return deleteProduct;
  }
}
