import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateEvaluationDto {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0, { message: 'Rating min 0 ' })
  @Max(5, { message: 'Rating max is 5' })
  rating: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500, { message: 'Must be at least 500 characters' })
  comment: string;
}
