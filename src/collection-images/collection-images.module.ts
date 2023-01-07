import { Module } from '@nestjs/common';
import { CollectionImagesService } from './collection-images.service';
import { CollectionImagesController } from './collection-images.controller';
import { MulterModule } from '@nestjs/platform-express';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, MulterModule.register({ dest: './uploads' })],
  controllers: [CollectionImagesController],
  providers: [CollectionImagesService],
})
export class CollectionImagesModule {}
