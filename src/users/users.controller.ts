import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Res,
} from '@nestjs/common';
import { Body, Delete, Patch } from '@nestjs/common/decorators';
import { Auth } from 'src/auth/auth.decorator';
import { Role } from 'src/auth/roles/role.enum';
import { UserDto } from './dto/user.dto';
import { User } from './users.decorator';
import { UsersService } from './users.service';
import fs = require('fs');
import * as argon2 from 'argon2';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Auth(Role.Admin)
  @Get('all')
  async getAll(@Res() response, @User('id') id: string) {
    console.log(id);
    const findAll = await this.usersService.findAll();
    if (!findAll) {
      throw new NotFoundException(`No users found`);
    }

    return response.status(HttpStatus.OK).send(findAll);
  }

  @Auth()
  @Get(':userID')
  async getUserwithID(
    @Param('userID') userID: string,
    @Res() response,
    @User('id') id: string,
    @User('role') role: string,
  ) {
    if (id !== userID && role !== 'admin') {
      throw new BadRequestException(`Request Failed. Not have access`);
    }
    const findUser = await this.usersService.findUserwithID(userID);
    if (!findUser) {
      throw new NotFoundException(`User not found`);
    }
    return response.status(HttpStatus.OK).send(findUser);
  }

  @Auth()
  @Patch('edit/:userID')
  async editUser(
    @Param('userID') userID: string,
    @Res() response,
    @User('id') id: string,
    @User('role') role: string,
    @Body() dto: UserDto,
  ) {
    if (id !== userID && role !== 'admin') {
      throw new BadRequestException(`Request Failed. Not have access`);
    }
    try {
      const user = await this.usersService.findUserwithID(id);
      if (user && (await argon2.verify(user.password, dto.oldPassword))) {
        const editedUser = await this.usersService.editUser(userID, dto);
        return response.status(HttpStatus.OK).send(editedUser);
      }
      throw new BadRequestException(`Current password is not correct`);
    } catch (error) {
      console.log(error);
      throw new BadRequestException(
        error?.response?.message || 'Request Failed',
      );
    }
  }

  @Auth()
  @Delete('delete/:userID')
  async deleteUser(
    //id get from query param
    @Param('userID') userID: string,
    @Res() response,
    //id get from jwt
    @User('id') id: string,
    @User('role') role: string,
  ) {
    if (id !== userID && role !== 'admin') {
      throw new BadRequestException(`Request Failed. Not have access`);
    }
    try {
      const deletedUser = await this.usersService.deleteUser(userID);
      const linkRemove = deletedUser.userInfor.avatar;
      if (linkRemove) {
        fs.unlinkSync(`uploads/${linkRemove.slice(22)}`);
      }
      return response.status(HttpStatus.OK).send(deletedUser);
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException(error.meta.cause);
      }
      if (error.code === 'ENOENT') {
        return response.status(HttpStatus.OK).send({ message: 'Success' });
      }
      console.log(error);
      throw new BadRequestException('Request Failed');
    }
  }
}
