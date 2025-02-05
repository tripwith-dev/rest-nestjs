import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginUserDto } from '../user/dtos/user.login.req.dto';
import { AuthService } from './auth.service';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * 회원가입
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  /**
   * 로그인
   */
  @Post('login')
  logIn(
    @Body() userLoginDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.jwtLogIn(userLoginDto, response);
  }

  /**
   * 로그아웃
   */
  @Post('logout')
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
  }
}
