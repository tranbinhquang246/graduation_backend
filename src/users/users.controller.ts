import {
  Controller,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { Role } from 'src/auth/roles/role.enum';
import { User } from './users.decorator';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Auth(Role.User)
  @Get('all')
  async getAll(@Res() response, @User('userId') userId: string) {
    console.log(userId);
    const findAll = await this.usersService.findAll();
    if (!findAll) {
      throw new NotFoundException(`No users found`);
    }

    return response.status(HttpStatus.OK).send(findAll);
  }

  @Auth()
  @Get(':userID')
  async getUserwithID(@Param('userID') userId: string, @Res() response) {
    const findUser = await this.usersService.findUserwithID(userId);
    if (!findUser) {
      throw new NotFoundException(`User not found`);
    }
    return response.status(HttpStatus.OK).send(findUser);
  }
}
