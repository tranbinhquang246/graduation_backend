import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Res,
  BadRequestException,
  NotFoundException,
  HttpStatus,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { UserInforService } from './user-infor.service';
import { UpdateUserInforDto } from './dto/update-user-infor.dto';
import { Auth } from 'src/auth/auth.decorator';
import { User } from 'src/users/users.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';

const multerOptions = {
  storage: diskStorage({
    destination: './uploads/avatar',
    filename: (req, file, callback) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname);
      const fileName = `${file.originalname}-${uniqueSuffix}${ext}`;
      callback(null, fileName);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return callback(new Error('Only image files are allowed!'), false);
    }
    callback(null, true);
  },
};
@Controller('user-infor')
export class UserInforController {
  constructor(private readonly userInforService: UserInforService) {}

  @Auth()
  @Get(':userID')
  async find(
    @Param('userID') userID: string,
    @Res() response,
    @User('id') id: string,
    @User('role') role: string,
  ) {
    if (id !== userID && role !== 'admin') {
      throw new BadRequestException(`Request Failed. Not have access`);
    }
    const findUserInfor = await this.userInforService.find(userID);
    if (!findUserInfor) {
      throw new NotFoundException(`User not found`);
    }
    return response.status(HttpStatus.OK).send(findUserInfor);
  }

  @Auth()
  @Patch('edit/:userID')
  @UseInterceptors(FileInterceptor('avatar', multerOptions))
  async update(
    @UploadedFile() avatar: Express.Multer.File,
    @Param('userID') userID: string,
    @Res() response,
    @User('id') id: string,
    @User('role') role: string,
    @Body() updateUserInforDto: UpdateUserInforDto,
  ) {
    if (id !== userID && role !== 'admin') {
      throw new BadRequestException(`Request Failed. Not have access`);
    }
    try {
      const editedUserInfor = await this.userInforService.update(
        userID,
        JSON.parse(JSON.stringify(updateUserInforDto)),
        avatar,
      );
      return response.status(HttpStatus.OK).send(editedUserInfor);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }
}
