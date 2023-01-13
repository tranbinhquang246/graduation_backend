import { Module } from '@nestjs/common';
import { CartDetailService } from './cart-detail.service';
import { CartDetailController } from './cart-detail.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [PrismaModule, ProductsModule],
  controllers: [CartDetailController],
  providers: [CartDetailService],
  exports: [CartDetailService],
})
export class CartDetailModule {}
