import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Res,
} from '@nestjs/common';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class EvaluationService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string,
    createEvaluationDto: CreateEvaluationDto,
    @Res() response,
  ) {
    const findEvaluation = await this.prisma.evaluation.findMany({
      where: { userId: userId, productId: createEvaluationDto.productId },
    });
    if (findEvaluation.length !== 0) {
      return response
        .status(HttpStatus.BAD_REQUEST)
        .send({ data: findEvaluation, message: 'Evaluation available' });
    }
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
      include: {
        user: {
          include: {
            userInfor: true,
          },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    return findAll;
  }

  async findOne(productId: number, userId: string) {
    const findEvaluation = await this.prisma.evaluation.findMany({
      where: { productId: productId, userId: userId },
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

//one account only has one comment, count comment
