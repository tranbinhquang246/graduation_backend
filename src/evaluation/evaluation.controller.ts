import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  HttpStatus,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { Auth } from 'src/auth/auth.decorator';
import { User } from 'src/users/users.decorator';
import { ProductsService } from 'src/products/products.service';
import { PrismaService } from 'src/prisma/prisma.service';

async function calculateRoundedAverage(current: number, rating: number) {
  const sum = current + rating;
  const average = sum / 2;
  const rounded = Math.round(average * 2);
  return rounded / 2;
}
async function unCalculateRoundedAverage(
  currentProductRating: number,
  currentEvaluationRating: number,
) {
  const lastSum = currentProductRating * 2 - currentEvaluationRating;
  return lastSum;
}
@Controller('evaluation')
export class EvaluationController {
  constructor(
    private prisma: PrismaService,
    private readonly evaluationService: EvaluationService,
    private productsService: ProductsService,
  ) {}
  @Auth()
  @Post()
  async create(
    @User('id') id: string,
    @Body() createEvaluationDto: CreateEvaluationDto,
    @Res() response,
  ) {
    try {
      const ratingProducts = await this.productsService.getRatingProduct(
        createEvaluationDto.productId,
      );
      const newEvaluation = await this.evaluationService.create(
        id,
        createEvaluationDto,
        response,
      );
      const newRatingProduct = calculateRoundedAverage(
        ratingProducts.rating,
        createEvaluationDto.rating,
      );
      await this.productsService.updateRating(
        createEvaluationDto.productId,
        await newRatingProduct,
      );
      return response.status(HttpStatus.OK).send(newEvaluation);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }

  @Get('all/:productId')
  async findAll(@Param('productId') productId: string, @Res() response) {
    try {
      const findAll = await this.evaluationService.findAll(+productId);
      return response.status(HttpStatus.OK).send(findAll);
    } catch (error) {
      throw new NotFoundException(`No evaluation found`);
    }
  }

  @Auth()
  @Get(':productId')
  async findOne(
    @Param('productId') productId: string,
    @User('id') id: string,
    @Res() response,
  ) {
    try {
      const findEvaluation = await this.evaluationService.findOne(
        +productId,
        id,
      );
      return response.status(HttpStatus.OK).send(findEvaluation);
    } catch (error) {
      throw new NotFoundException(`No evaluation found`);
    }
  }

  @Auth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @User('id') userId: string,
    @Body() updateEvaluationDto: UpdateEvaluationDto,
    @Res() response,
  ) {
    try {
      const currentProductRating = await this.productsService.getRatingProduct(
        updateEvaluationDto.productId,
      );
      const currentRatingEvaluation = await this.prisma.evaluation.findFirst({
        where: {
          productId: updateEvaluationDto.productId,
          userId: userId,
        },
        select: {
          rating: true,
        },
      });
      const editedEvaluation = await this.evaluationService.update(
        +id,
        userId,
        updateEvaluationDto,
      );
      const lastRatingProduct = await unCalculateRoundedAverage(
        currentProductRating.rating,
        currentRatingEvaluation.rating,
      );
      const newRatingProduct = await calculateRoundedAverage(
        lastRatingProduct,
        updateEvaluationDto.rating,
      );
      await this.productsService.updateRating(
        updateEvaluationDto.productId,
        newRatingProduct,
      );
      return response.status(HttpStatus.OK).send(editedEvaluation);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }

  @Auth()
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @User('id') userId: string,
    @Res() response,
  ) {
    try {
      const deletedEvaluation = await this.evaluationService.remove(
        +id,
        userId,
      );
      return response.status(HttpStatus.OK).send(deletedEvaluation);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }
}
