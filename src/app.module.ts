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
import { CartModule } from './cart/cart.module';
import { CartDetailModule } from './cart-detail/cart-detail.module';
import { OrdersModule } from './orders/orders.module';
import { LookupDataModule } from './lookup-data/lookup-data.module';
import { CollectionImagesModule } from './collection-images/collection-images.module';
import { BannerAdsModule } from './banner-ads/banner-ads.module';

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
    CartModule,
    CartDetailModule,
    OrdersModule,
    LookupDataModule,
    CollectionImagesModule,
    BannerAdsModule,
  ],
  providers: [],
})
export class AppModule {}
