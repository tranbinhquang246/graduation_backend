import { PartialType } from '@nestjs/swagger';
import { CreateAddressDeliveryDto } from './create-address-delivery.dto';

export class UpdateAddressDeliveryDto extends PartialType(
  CreateAddressDeliveryDto,
) {}
