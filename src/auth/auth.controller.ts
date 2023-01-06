import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Body() dto: AuthDto) {
    return await this.authService.login(dto);
  }

  @Post('register')
  async register(@Body() dto: AuthDto) {
    const registerSuccess = await this.usersService.createUser(dto);
    if (registerSuccess) {
      return this.authService.login(dto);
    }
  }
}
