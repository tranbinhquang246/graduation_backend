import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(data: AuthDto) {
    const user = await this.usersService.findUserwithEmail(data.email);
    if (user && (await argon2.verify(user.password, data.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(data: AuthDto) {
    const dataUser = await this.usersService.findUserwithEmail(data.email);
    const payload = {
      id: dataUser.id,
      email: dataUser.email,
      role: dataUser.userRole,
    };

    return {
      user: dataUser,
      access_token: this.jwtService.sign(payload),
    };
  }
}
