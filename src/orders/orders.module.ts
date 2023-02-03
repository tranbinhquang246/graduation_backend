import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CartDetailModule } from 'src/cart-detail/cart-detail.module';

@Module({
  imports: [PrismaModule, CartDetailModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
