import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtRefreshTokenGuard extends AuthGuard('refresh-jwt') {
  handleRequest(err: any, user: any, info: any) {
    if (info instanceof Error && info.message === 'No auth token') {
      throw new UnauthorizedException('No refresh token provided');
    }

    if (err || !user) {
      throw new ForbiddenException('Invalid refresh token');
    }
    return user;
  }
}
