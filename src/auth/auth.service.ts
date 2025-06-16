import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { excludePassword } from 'src/common/helpers/exclude-password.helper';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UserResponse } from 'src/users/entities/user-response.entry';
import { UserService } from 'src/users/user.service';
import { SignUpResponse } from './dto/signup.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  private async validateUser(
    login: string,
    password: string,
  ): Promise<UserResponse> {
    const user = await this.usersService.findOneByLogin(login);

    if (!user) throw new BadRequestException();

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new BadRequestException();

    return excludePassword(user);
  }

  private async getTokens(
    userId: string,
    login: string,
  ): Promise<SignUpResponse> {
    const payload = { userId, login };

    try {
      const accessToken = await this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET_KEY'),
        expiresIn: this.config.get('TOKEN_EXPIRE_TIME'),
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET_REFRESH_KEY'),
        expiresIn: this.config.get('TOKEN_REFRESH_EXPIRE_TIME'),
      });

      return { accessToken, refreshToken };
    } catch (err) {
      console.error('JWT generation failed:', err);

      throw err;
    }
  }

  private async updateUserRefreshToken(id: string, refreshToken: string) {
    await this.usersService.updateJwtToken(id, refreshToken);
  }

  async signup(createUserDto: CreateUserDto) {
    const { login, password } = createUserDto;

    const hashedPassword = await bcrypt.hash(
      password,
      +this.config.get('CRYPT_SALT'),
    );

    const createdUser = await this.usersService.create({
      login,
      password: hashedPassword,
    });

    const jwtTokens = await this.getTokens(createdUser.id, createdUser.login);

    await this.updateUserRefreshToken(createdUser.id, jwtTokens.refreshToken);

    return {
      id: createdUser.id,
      ...jwtTokens,
    };
  }

  async login(loginDto: CreateUserDto) {
    const user = await this.validateUser(loginDto.login, loginDto.password);

    const tokens = await this.getTokens(user.id, user.login);

    await this.updateUserRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    const { userId } = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.config.get('JWT_SECRET_REFRESH_KEY'),
    });

    const user = await this.usersService.findOneById(userId);
    console.log('user: ', user);

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    if (user.refreshToken !== refreshToken) {
      throw new ForbiddenException('Refresh token mismatch');
    }

    const tokens = await this.getTokens(user.id, user.login);

    await this.updateUserRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }
}
