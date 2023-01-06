import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { Prisma, Users } from '@prisma/client';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: AuthDto) {
    const hashPassword = await argon2.hash(data.password);
    try {
      const newUser = await this.prisma.users.create({
        data: {
          email: data.email,
          password: hashPassword,
          userRole: 'user',
        },
      });
      await this.prisma.user_Infor.create({
        data: { userId: newUser.id },
      });
      await this.prisma.cart.create({
        data: { userId: newUser.id },
      });
      return newUser;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new BadRequestException(`Email already exist`);
        }
      }

      throw new BadRequestException(`Request Failed`);
    }
  }

  async findUserwithEmail(email: string) {
    const findUser = await this.prisma.users.findUnique({
      where: {
        email: email,
      },
    });
    if (!findUser) {
      throw new NotFoundException(`User does not exist`);
    }
    return findUser;
  }

  async findUserwithID(id: string): Promise<Users> {
    const findUser = await this.prisma.users.findUnique({
      where: { id: id },
      include: {
        userInfor: true,
        Cart: {
          include: {
            cartDetail: true,
          },
        },
      },
    });
    return findUser;
  }

  async findAll(): Promise<Users[]> {
    const findAll = await this.prisma.users.findMany({
      include: { userInfor: true },
    });
    return findAll;
  }

  async editUser(id: string, dto: UserDto): Promise<Users> {
    const updateUser = await this.prisma.users.update({
      where: {
        id: id,
      },
      data: dto,
    });
    return updateUser;
  }

  async deleteUser(id: string) {
    if (id === 'anonymous') {
      throw new BadRequestException(`Request Failed`);
    }
    const deleteUser = await this.prisma.users.delete({
      where: {
        id: id,
      },
      include: { userInfor: true },
    });
    return deleteUser;
  }
}
