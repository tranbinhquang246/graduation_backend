import { Module } from '@nestjs/common';
import { UserInforService } from './user-infor.service';
import { UserInforController } from './user-infor.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserInforController],
  providers: [UserInforService],
  exports: [UserInforService],
})
export class UserInforModule {}
