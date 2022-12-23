import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateCartDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cartId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
