import {
  Controller,
  Post,
  Body,
  Inject,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto, signupDto } from './dto/auth.dto';
import { Response } from 'express';
@Controller('api/v1')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() logindto: loginDto, @Res() res: Response) {
    try {
      const response = await this.authService.login(logindto, res);
      return response;
    } catch (error) {
      throw new BadRequestException('Có lỗi xảy ra trong quá trình đăng nhập');
    }
  }

  @Post('register')
  async signup(@Body() signupdto: signupDto) {
    try {
      const response = await this.authService.signup(signupdto);
      return response;
    } catch (error) {
      throw new BadRequestException('Có lỗi xảy ra trong quá trình đăng ký');
    }
  }
}
