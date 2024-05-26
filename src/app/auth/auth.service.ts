import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AUTH_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from 'src/common/constant';
import ResponseRequest from 'src/common/ResponseRequest';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async refreshToken(user: any) {
    const payload = user
      ? {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        }
      : null;

    return user
      ? new ResponseRequest({
          status: 200,
          error: null,
          data: {
            accessToken: await this.jwtService.signAsync(payload, {
              expiresIn: AUTH_TOKEN_EXPIRE,
              secret: process.env.jwtSecretKey,
            }),
            refreshToken: await this.jwtService.signAsync(payload, {
              expiresIn: REFRESH_TOKEN_EXPIRE,
              secret: process.env.jwtRefreshTokenKey,
            }),
          },
        })
      : new ResponseRequest({
          status: 500,
          error: {
            msg: 'Internal error',
            error: 'the payload is not correct',
          },
          data: null,
        });
  }
}
