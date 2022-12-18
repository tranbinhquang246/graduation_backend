import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAddressDeliveryDto } from './dto/create-address-delivery.dto';
import { UpdateAddressDeliveryDto } from './dto/update-address-delivery.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AddressDeliveryService {
  constructor(private prisma: PrismaService) {}

  async create(
    createAddressDeliveryDto: CreateAddressDeliveryDto,
    userId: string,
  ) {
    const newAddressDelivery = await this.prisma.address_Delivery.create({
      data: {
        userId: userId,
        ...createAddressDeliveryDto,
      },
    });
    return newAddressDelivery;
  }

  async findAll(userId: string) {
    const findAll = await this.prisma.address_Delivery.findMany({
      where: { userId: userId },
    });
    return findAll;
  }

  async findOne(userId: string, id: number) {
    const findOne = await this.prisma.address_Delivery.findMany({
      where: {
        AND: [{ userId: userId }, { id: id }],
      },
    });
    return findOne;
  }

  async update(
    id: number,
    userId: string,
    updateAddressDeliveryDto: UpdateAddressDeliveryDto,
  ) {
    const findData = await this.prisma.address_Delivery.findUnique({
      where: {
        id: id,
      },
    });
    if (findData.userId !== userId) {
      throw new BadRequestException(`Request Failed`);
    }
    const updateAddress = await this.prisma.address_Delivery.update({
      where: {
        id: id,
      },
      data: updateAddressDeliveryDto,
    });
    return updateAddress;
  }

  async remove(id: number, userId: string) {
    const findData = await this.prisma.address_Delivery.findUnique({
      where: {
        id: id,
      },
    });
    if (findData.userId !== userId) {
      throw new BadRequestException(`Request Failed`);
    }
    const removeAddress = await this.prisma.address_Delivery.delete({
      where: { id: id },
    });
    return removeAddress;
  }
}
