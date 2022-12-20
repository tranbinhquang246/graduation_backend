import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { UserInforModule } from './user-infor/user-infor.module';
import { AddressDeliveryModule } from './address-delivery/address-delivery.module';
import { EvaluationModule } from './evaluation/evaluation.module';
import { FavoriteModule } from './favorite/favorite.module';
import { SubImageModule } from './sub-image/sub-image.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveStaticOptions: {
        index: false,
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    PrismaModule,
    ProductsModule,
    UserInforModule,
    AddressDeliveryModule,
    EvaluationModule,
    FavoriteModule,
    SubImageModule,
  ],
  providers: [],
})
export class AppModule {}
