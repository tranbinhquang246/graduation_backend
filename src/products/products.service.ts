import { Injectable } from '@nestjs/common';
import { Products } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const newProducts = await this.prisma.products.create({
      data: createProductDto,
    });
    return newProducts;
  }

  async findAll(): Promise<Products[]> {
    const findAll = await this.prisma.products.findMany();
    return findAll;
  }

  async findOne(id: number): Promise<Products> {
    const findProduct = await this.prisma.products.findUnique({
      where: { id: id },
    });
    return findProduct;
  }

  async update(
    id: number,
    updateProductDto: UpdateProductDto,
  ): Promise<Products> {
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
