import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { LookupDataService } from './lookup-data.service';
// import { CreateLookupDatumDto } from './dto/create-lookup-datum.dto';
// import { UpdateLookupDatumDto } from './dto/update-lookup-datum.dto';

@Controller('lookup-data')
export class LookupDataController {
  constructor(private readonly lookupDataService: LookupDataService) {}

  @Get('type')
  async findType() {
    const lookupType = await this.lookupDataService.findType();
    return lookupType;
  }
  @Get('design')
  async findDesign() {
    const lookupDesign = await this.lookupDataService.findDesign();
    return lookupDesign;
  }
  @Get('material')
  async findMaterial() {
    const lookupMaterial = await this.lookupDataService.findMaterial();
    return lookupMaterial;
  }
  @Get('brand')
  async findBrand() {
    const lookupBrand = await this.lookupDataService.findBrand();
    return lookupBrand;
  }
  @Get('color')
  async findColor() {
    const lookupColor = await this.lookupDataService.findColor();
    return lookupColor;
  }
  //   @Post()
  //   create(@Body() createLookupDatumDto: CreateLookupDatumDto) {
  //     return this.lookupDataService.create(createLookupDatumDto);
  //   }

  //   @Get()
  //   findAll() {
  //     return this.lookupDataService.findAll();
  //   }

  //   @Get(':id')
  //   findOne(@Param('id') id: string) {
  //     return this.lookupDataService.findOne(+id);
  //   }

  //   @Patch(':id')
  //   update(
  //     @Param('id') id: string,
  //     @Body() updateLookupDatumDto: UpdateLookupDatumDto,
  //   ) {
  //     return this.lookupDataService.update(+id, updateLookupDatumDto);
  //   }

  //   @Delete(':id')
  //   remove(@Param('id') id: string) {
  //     return this.lookupDataService.remove(+id);
  //   }
}
