import { Injectable } from '@nestjs/common';
// import { CreateLookupDatumDto } from './dto/create-lookup-datum.dto';
// import { UpdateLookupDatumDto } from './dto/update-lookup-datum.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LookupDataService {
  constructor(private prisma: PrismaService) {}
  //   create(createLookupDatumDto: CreateLookupDatumDto) {
  //     return 'This action adds a new lookupDatum';
  //   }
  //   findAll() {
  //     return `This action returns all lookupData`;
  //   }
  //   findOne(id: number) {
  //     return `This action returns a #${id} lookupDatum`;
  //   }
  //   update(id: number, updateLookupDatumDto: UpdateLookupDatumDto) {
  //     return `This action updates a #${id} lookupDatum`;
  //   }
  //   remove(id: number) {
  //     return `This action removes a #${id} lookupDatum`;
  //   }

  async findType() {
    return await this.prisma.lookupType.findMany();
  }

  async findDesign() {
    return await this.prisma.lookupDesign.findMany();
  }
  async findBrand() {
    return await this.prisma.lookupBrand.findMany();
  }
  async findMaterial() {
    return await this.prisma.lookupMaterial.findMany();
  }
  async findColor() {
    return await this.prisma.lookupColor.findMany();
  }
}
