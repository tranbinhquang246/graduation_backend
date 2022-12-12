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

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: AuthDto, @Res() response) {
    const hashPassword = await argon2.hash(data.password);
    try {
      await this.prisma.users.create({
        data: {
          email: data.email,
          password: hashPassword,
          userRole: 'user',
        },
      });
      return response
        .status(HttpStatus.OK)
        .send({ message: 'Create Account Susscessfully' });
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
    });
    return findUser;
  }

  async findAll(): Promise<Users[]> {
    const findAll = await this.prisma.users.findMany();
    return findAll;
  }
}
