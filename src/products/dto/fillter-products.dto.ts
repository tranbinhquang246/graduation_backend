import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class FillterProductDTO {
  @MaxLength(64)
  @IsString()
  searchWord: string;

  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @Min(1)
  @IsPositive()
  page: number;

  @Transform(({ value }) => Number.parseInt(value))
  @IsNumber()
  @Min(1)
  @IsPositive()
  limit: number;

  @IsString()
  color: string;

  @IsString()
  material: string;

  @IsString()
  design: string;

  @IsString()
  type: string;

  @IsString()
  brand: string;
}
