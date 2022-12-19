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
  @IsInt()
  @Min(0, { message: 'Rating min 0 ' })
  @Max(5, { message: 'Rating max is 5' })
  @Transform(({ value }) => Number.parseInt(value))
  rating: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500, { message: 'Must be at least 500 characters' })
  comment: string;
}
