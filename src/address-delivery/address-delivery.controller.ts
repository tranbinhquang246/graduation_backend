import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { AddressDeliveryService } from './address-delivery.service';
import { CreateAddressDeliveryDto } from './dto/create-address-delivery.dto';
import { UpdateAddressDeliveryDto } from './dto/update-address-delivery.dto';
import { Auth } from 'src/auth/auth.decorator';
import { User } from 'src/users/users.decorator';

@Controller('address-delivery')
export class AddressDeliveryController {
  constructor(
    private readonly addressDeliveryService: AddressDeliveryService,
  ) {}

  @Auth()
  @Post()
  async create(
    @Body() createAddressDeliveryDto: CreateAddressDeliveryDto,
    @Res() response,
    @User('id') id: string,
  ) {
    const newAddress = await this.addressDeliveryService.create(
      createAddressDeliveryDto,
      id,
    );
    if (!newAddress) {
      throw new BadRequestException(`Request Failed`);
    }
    return response.status(HttpStatus.OK).send(newAddress);
  }

  @Auth()
  @Get()
  async findAll(@Res() response, @User('id') id: string) {
    try {
      const allAddress = await this.addressDeliveryService.findAll(id);
      return response.status(HttpStatus.OK).send(allAddress);
    } catch (error) {
      throw new NotFoundException(`Address Delivery not found`);
    }
  }

  @Auth()
  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @Res() response,
    @User('id') userId: string,
  ) {
    try {
      const address = await this.addressDeliveryService.findOne(userId, +id);
      return response.status(HttpStatus.OK).send(address);
    } catch (error) {
      throw new NotFoundException(`Address Delivery not found`);
    }
  }

  @Auth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @User('id') userId: string,
    @Res() response,
    @Body() updateAddressDeliveryDto: UpdateAddressDeliveryDto,
  ) {
    try {
      const editedAddress = await this.addressDeliveryService.update(
        +id,
        userId,
        updateAddressDeliveryDto,
      );
      return response.status(HttpStatus.OK).send(editedAddress);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }

  @Auth()
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @User('id') userId: string,
    @Res() response,
  ) {
    try {
      const deletedAddress = await this.addressDeliveryService.remove(
        +id,
        userId,
      );
      return response.status(HttpStatus.OK).send(deletedAddress);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }
}
