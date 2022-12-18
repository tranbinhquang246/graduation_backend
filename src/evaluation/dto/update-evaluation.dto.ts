import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateEvaluationDto {
  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsString()
  comment: string;
}
