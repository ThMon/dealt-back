import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { API_PREFIX_URL } from 'src/common/constant';
import { CreateUserDto, loginDto } from './dto/user.dto';
import { JwtGuard } from '../auth/guards/jwt.guard';

@Controller({ path: `${API_PREFIX_URL}/user` })
export class UserController {
  constructor(private userService: UserService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.create(createUserDto);
    return result;
  }

  @Post('signin')
  async signin(@Body() loginDto: loginDto) {
    const result = await this.userService.login(loginDto);
    return result;
  }

  @UseGuards(JwtGuard)
  @Get('findById/:id')
  async getUserProfile(@Param('id') id: string, @Request() req) {
    return await this.userService.findById(id);
  }
}
