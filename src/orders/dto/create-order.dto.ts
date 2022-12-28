import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  totalOrder: number;

  products: [
    {
      productId: number;
      quantity: number;
      price: number;
    },
  ];
}
