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
} from '@nestjs/common';
import { UserInforService } from './user-infor.service';
import { UpdateUserInforDto } from './dto/update-user-infor.dto';
import { Auth } from 'src/auth/auth.decorator';
import { User } from 'src/users/users.decorator';

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
  async update(
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
        updateUserInforDto,
      );
      return response.status(HttpStatus.OK).send(editedUserInfor);
    } catch (error) {
      throw new BadRequestException(`Request Failed`);
    }
  }
}
