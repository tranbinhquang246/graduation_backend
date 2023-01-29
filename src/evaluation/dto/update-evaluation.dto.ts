import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateEvaluationDto {
  @IsNotEmpty()
  @IsString()
  comment: string;
}
