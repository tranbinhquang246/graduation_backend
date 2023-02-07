import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';
import { HttpModule } from '@nestjs/axios';
import { FavoriteModule } from 'src/favorite/favorite.module';

@Module({
  imports: [
    PrismaModule,
    FavoriteModule,
    HttpModule,
    MulterModule.register({ dest: './uploads' }),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
