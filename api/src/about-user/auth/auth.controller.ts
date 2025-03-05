import {
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UpdateResult } from 'typeorm';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { IsUserSelfGuard } from '../jwt/user.self.guard';
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
    // 이메일 유효성 검증 추가해야 함 @, .com 형태, 및 특수기호 . 제외
    // 이름 유효성 검증할 때, 문자열 사이에 띄어쓰기는 허용해야 함
    // 단 공백은 허용하면 안됨.
    return await this.authService.register(registerDto);
  }

  /**
   * 로그인
   */
  @Post('login')
  @HttpCode(200)
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
  @UseGuards(JwtAuthGuard)
  async logOut(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('jwt');
  }

  @Patch(':userId/delete')
  @UseGuards(JwtAuthGuard, IsUserSelfGuard)
  async softDeleteUser(@Param('userId') userId: number): Promise<UpdateResult> {
    return await this.authService.softDeleteUser(userId);
  }
}
