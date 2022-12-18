import { Module } from '@nestjs/common';
import { AddressDeliveryService } from './address-delivery.service';
import { AddressDeliveryController } from './address-delivery.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AddressDeliveryController],
  providers: [AddressDeliveryService],
  exports: [AddressDeliveryService],
})
export class AddressDeliveryModule {}
