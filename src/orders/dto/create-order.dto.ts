import { IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  cartId: number;

  @IsPositive()
  @IsNumber()
  @IsNotEmpty()
  totalOrder: number;

  @IsNotEmpty()
  deliveryAddress: string;

  products: [
    {
      productId: number;
      quantity: number;
      price: number;
    },
  ];
}
