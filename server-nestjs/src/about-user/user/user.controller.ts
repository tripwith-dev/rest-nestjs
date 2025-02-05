import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * <테스트용> 배포 시에 주석 처리
   * 사용자 패스워드를 제외한 모든 정보 가져옴.
   */
  @Get('verify-users/:userId')
  async findUserByIdForVerify(
    @Param('userId') userId,
  ): Promise<UserEntity | undefined> {
    return await this.userService.findUserWithAvatarByUserId(userId);
  }

  /**
   * 사용자 계정 정보에서 사용됨
   * email, 이름 등 계정 정보 조회
   */
  @Get('/:userId')
  @UseGuards(JwtAuthGuard)
  async findUserById(@Param('userId') userId): Promise<UserEntity | undefined> {
    return await this.userService.findUserById(userId);
  }
}
