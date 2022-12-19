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

@Controller('evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Auth()
  @Post()
  async create(
    @User('id') id: string,
    @Body() createEvaluationDto: CreateEvaluationDto,
    @Res() response,
  ) {
    try {
      const newEvaluation = await this.evaluationService.create(
        id,
        createEvaluationDto,
        response,
      );
      return response.status(HttpStatus.OK).send(newEvaluation);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }

  @Auth()
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
  @Get(':id')
  async findOne(@Param('id') id: string, @Res() response) {
    try {
      const findEvaluation = await this.evaluationService.findOne(+id);
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
      const editedEvaluation = await this.evaluationService.update(
        +id,
        userId,
        updateEvaluationDto,
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
