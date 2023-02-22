import { Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  descriptions: string;

  @IsNotEmpty()
  rating: number;

  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value))
  quantity: number;

  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value))
  price: number;

  @IsInt()
  @IsNotEmpty()
  @Transform(({ value }) => Number.parseInt(value))
  salePrice: number;

  @IsNotEmpty()
  @IsString()
  color: string;

  @IsNotEmpty()
  @IsString()
  material: string;

  @IsNotEmpty()
  @IsString()
  design: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  brand: string;
}
