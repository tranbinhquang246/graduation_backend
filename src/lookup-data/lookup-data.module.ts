import { Module } from '@nestjs/common';
import { LookupDataService } from './lookup-data.service';
import { LookupDataController } from './lookup-data.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [LookupDataController],
  providers: [LookupDataService],
})
export class LookupDataModule {}
