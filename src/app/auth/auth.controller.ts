import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './guards/refresh.guard';
import { API_PREFIX_URL } from 'src/common/constant';

@Controller({ path: `${API_PREFIX_URL}/auth` })
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(RefreshJwtGuard)
  @Post('refreshAccessToken')
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(req.user);
  }
}
