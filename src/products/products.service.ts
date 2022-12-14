import { BadRequestException, Injectable } from '@nestjs/common';
import { Products } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FillterProductDTO } from './dto/fillter-products.dto';

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

  async findAll(
    fillterProductDTO: FillterProductDTO,
  ): Promise<{ data: Products[] }> {
    const findProduct = await this.prisma.products.findMany({
      where: {
        AND: [
          fillterProductDTO.type ? { type: fillterProductDTO.type } : {},
          fillterProductDTO.brand ? { brand: fillterProductDTO.brand } : {},
          fillterProductDTO.color ? { color: fillterProductDTO.color } : {},
          fillterProductDTO.design ? { design: fillterProductDTO.design } : {},
          fillterProductDTO.material
            ? { material: fillterProductDTO.material }
            : {},
          fillterProductDTO.searchWord
            ? {
                name: {
                  contains: fillterProductDTO.searchWord,
                },
              }
            : {},
        ],
      },
      skip: (fillterProductDTO.page - 1) * fillterProductDTO.limit || 0,
      take: fillterProductDTO.limit * 1 || 6,
      orderBy: {
        updatedAt: 'desc',
      },
    });
    const productsCount = await this.prisma.products.findMany({
      where: {
        AND: [
          fillterProductDTO.type ? { type: fillterProductDTO.type } : {},
          fillterProductDTO.brand ? { brand: fillterProductDTO.brand } : {},
          fillterProductDTO.color ? { color: fillterProductDTO.color } : {},
          fillterProductDTO.design ? { design: fillterProductDTO.design } : {},
          fillterProductDTO.material
            ? { material: fillterProductDTO.material }
            : {},
          fillterProductDTO.searchWord
            ? {
                name: {
                  contains: fillterProductDTO.searchWord,
                },
              }
            : {},
        ],
      },
    });
    const totalPage = await Math.ceil(
      productsCount.length / fillterProductDTO.limit,
    );
    const data = {
      data: findProduct,
      currentPage: fillterProductDTO.page * 1 || 1,
      totalPage: totalPage,
    };
    return data;
  }

  async findOne(id: number): Promise<Products> {
    const findProduct = await this.prisma.products.findUnique({
      where: { id: id },
      include: { subImg: true, evaluation: true },
    });
    return findProduct;
  }

  async getNewestProducts(): Promise<Products[]> {
    const newestProducts = await this.prisma.products.findMany({
      take: 8,
      orderBy: {
        createdAt: 'desc',
      },
    });
    return newestProducts;
  }

  async getSaleProducts(): Promise<any> {
    const saleProducts = await this.prisma.$queryRaw`
  SELECT TOP 8 *
  FROM Products
  WHERE salePrice < price
`;
    return saleProducts;
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
