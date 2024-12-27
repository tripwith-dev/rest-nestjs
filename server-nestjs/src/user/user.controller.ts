import { Controller, Get, Param } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 테스트용
   * 사용자 패스워드를 제외한 모든 정보 가져옴.
   */
  @Get('check/:userId')
  async findUserByUserId(
    @Param('userId') userId,
  ): Promise<UserEntity | undefined> {
    return await this.userService.findUserByUserId(userId);
  }

  /**
   * 사용자 페이지에서 사용됨.
   * 사용자가 생성한 카테고리도 같이 볼 수 있음.
   * 다른 사람도 볼 수 있는 기본 정보만 리턴.
   */
  @Get(':userId')
  async findUserWithCategoryByUserId(
    @Param('userId') userId,
  ): Promise<UserEntity | undefined> {
    return await this.userService.findUserWithCategoryByUserId(userId);
  }
}
