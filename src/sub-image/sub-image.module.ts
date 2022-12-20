import { Module } from '@nestjs/common';
import { SubImageService } from './sub-image.service';
import { SubImageController } from './sub-image.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [PrismaModule, MulterModule.register({ dest: './uploads' })],
  controllers: [SubImageController],
  providers: [SubImageService],
  exports: [SubImageService],
})
export class SubImageModule {}
