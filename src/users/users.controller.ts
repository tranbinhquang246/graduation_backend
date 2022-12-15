import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Body, Delete, Patch, Post } from '@nestjs/common/decorators';
import { Auth } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Role } from 'src/auth/roles/role.enum';
import { UserDto } from './dto/user.dto';
import { User } from './users.decorator';
import { UsersService } from './users.service';

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
    const editedUser = await this.usersService.editUser(id, dto);
    if (!editedUser) {
      throw new BadRequestException(`Request Failed`);
    }
    return response.status(HttpStatus.OK).send(editedUser);
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
    const deletedUser = await this.usersService.deleteUser(id);
    if (!deletedUser) {
      throw new BadRequestException(`Request Failed`);
    }
    return response.status(HttpStatus.OK).send(deletedUser);
  }
}
//handle for delete and edit 500 error
