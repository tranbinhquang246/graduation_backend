import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createEvaluationDto: CreateEvaluationDto) {
    const newEvaluation = await this.prisma.evaluation.create({
      data: {
        userId: userId,
        ...createEvaluationDto,
      },
    });

    return newEvaluation;
  }

  async findAll(productId: number) {
    const findAll = await this.prisma.evaluation.findMany({
      where: {
        productId: productId,
      },
    });
    return findAll;
  }

  async findOne(id: number) {
    const findEvaluation = await this.prisma.evaluation.findUnique({
      where: { id: id },
    });
    return findEvaluation;
  }

  async update(
    id: number,
    userId: string,
    updateEvaluationDto: UpdateEvaluationDto,
  ) {
    const findData = await this.prisma.evaluation.findUnique({
      where: {
        id: id,
      },
    });
    if (findData.userId !== userId) {
      throw new BadRequestException(`Request Failed`);
    }

    const updateEvaluation = await this.prisma.evaluation.update({
      where: { id: id },
      data: {
        rating: updateEvaluationDto.rating,
        comment: updateEvaluationDto.comment,
      },
    });
    return updateEvaluation;
  }

  async remove(id: number, userId: string) {
    const findData = await this.prisma.evaluation.findUnique({
      where: {
        id: id,
      },
    });
    if (findData.userId !== userId) {
      throw new BadRequestException(`Request Failed`);
    }

    const deleteEvaluation = await this.prisma.evaluation.delete({
      where: { id: id },
    });
    return deleteEvaluation;
  }
}
