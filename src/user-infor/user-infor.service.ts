import { Injectable } from '@nestjs/common';
import { UpdateUserInforDto } from './dto/update-user-infor.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserInforService {
  constructor(private prisma: PrismaService) {}
  async find(id: string) {
    const findUserInfor = await this.prisma.user_Infor.findUnique({
      where: {
        userId: id,
      },
    });
    return findUserInfor;
  }

  async update(
    id: string,
    updateUserInforDto: UpdateUserInforDto,
    avatar: Express.Multer.File,
  ) {
    if (avatar) {
      const updateUserInfor = await this.prisma.user_Infor.update({
        where: { userId: id },
        data: {
          ...updateUserInforDto,
          avatar: `${process.env.URL_PICTURE_AVATAR}${avatar.filename}`,
        },
      });
      return updateUserInfor;
    }
    const updateUserInfor = await this.prisma.user_Infor.update({
      where: { userId: id },
      data: updateUserInforDto,
    });
    return updateUserInfor;
  }
}
