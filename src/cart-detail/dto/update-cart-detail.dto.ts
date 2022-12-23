import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class UpdateCartDetailDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  quantity: number;
}
