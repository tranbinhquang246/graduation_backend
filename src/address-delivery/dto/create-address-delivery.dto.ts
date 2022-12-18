import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAddressDeliveryDto {
  @IsNotEmpty()
  @IsString()
  province: string;

  @IsNotEmpty()
  @IsString()
  district: string;

  @IsNotEmpty()
  @IsString()
  commune: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
