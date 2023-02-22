import { Injectable } from '@nestjs/common';
import { Products } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FillterProductDTO } from './dto/fillter-products.dto';
import { HttpService } from '@nestjs/axios';
import { FavoriteService } from 'src/favorite/favorite.service';

@Injectable()
export class ProductsService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
    private favoriteService: FavoriteService,
  ) {}

  async create(
    createProductDto: CreateProductDto,
    mainImg: Express.Multer.File,
  ) {
    createProductDto.quantity = +createProductDto.quantity;
    createProductDto.price = +createProductDto.price;
    createProductDto.salePrice = +createProductDto.salePrice;
    createProductDto.rating = +createProductDto.rating;

    const newProducts = await this.prisma.products.create({
      data: {
        ...createProductDto,
        mainImg: `${process.env.URL_PICTURE_MAINIMAGE}${mainImg.filename}`,
      },
    });
    return newProducts;
  }

  async getAllwithoutFiller() {
    const allProducts = await this.prisma.products.findMany();
    return allProducts;
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
      take: fillterProductDTO.limit * 1 || 8,
      orderBy: {
        createdAt: 'desc',
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
      take: 10,
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
  async updateQuantity(id: number, quantity: number) {
    const updateQuantity = await this.prisma.products.update({
      where: { id: id },
      data: { quantity: quantity },
    });
    return updateQuantity;
  }

  async getRecommendation(name: string): Promise<any> {
    const recommentProduct = await this.httpService
      .get(`${process.env.URL_RECOMMENDED_SYSTEM}product/${name}`)
      .toPromise();
    const nameArray = recommentProduct?.data.map(({ Name }) => Name);
    const products = await this.prisma.products.findMany({
      where: {
        name: {
          in: nameArray,
        },
      },
    });
    return products;
  }

  async getRecommendationFavorite(userId: string): Promise<any> {
    const favorite = await this.favoriteService.findAllwithUserIdOnlyName(
      userId,
    );
    const productNames = favorite.map((obj) => {
      return {
        Name: obj.product.name,
      };
    });
    const recommentProduct = await this.httpService
      .post(`${process.env.URL_RECOMMENDED_SYSTEM}favorite`, productNames, {
        headers: { 'Content-Type': 'application/json' },
      })
      .toPromise();
    const nameArray = recommentProduct?.data.map(({ Name }) => Name);
    const products = await this.prisma.products.findMany({
      where: {
        name: {
          in: nameArray,
        },
      },
    });
    return products;
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

  async getRatingProduct(id: number) {
    const ratingProduct = await this.prisma.products.findUnique({
      where: {
        id: id,
      },
      select: {
        rating: true,
      },
    });
    return ratingProduct;
  }

  async updateRating(id: number, rating: number) {
    const updateRatingProduct = await this.prisma.products.update({
      where: { id: id },
      data: {
        rating: rating,
      },
    });
    return updateRatingProduct;
  }

  async remove(id: number) {
    const deleteProduct = await this.prisma.products.delete({
      where: { id: id },
    });
    return deleteProduct;
  }
}
