import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { UserInforModule } from './user-infor/user-infor.module';
import { AddressDeliveryModule } from './address-delivery/address-delivery.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    PrismaModule,
    ProductsModule,
    UserInforModule,
    AddressDeliveryModule,
  ],
  providers: [],
})
export class AppModule {}
