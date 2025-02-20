import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { IsUserSelfGuard } from '../jwt/user.self.guard';
import { UpdatePasswordDto } from './dtos/password.update.dto';
import { UpdateUserNameDto } from './dtos/username.update.dto';
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
  @UseGuards(JwtAuthGuard, IsUserSelfGuard) // IsUserSelfGuard로 로그인 한 사용자가 파라미터 userId와 같아야만 요청 가능
  async findUserById(@Param('userId') userId): Promise<UserEntity | undefined> {
    return await this.userService.findUserById(userId);
  }

  @Patch('/:userId/username')
  @UseGuards(JwtAuthGuard, IsUserSelfGuard) // IsUserSelfGuard로 로그인 한 사용자가 파라미터 userId와 같아야만 요청 가능
  async updateUserName(
    @Param('userId') userId,
    @Body() updateUserNameDto: UpdateUserNameDto,
  ): Promise<UserEntity | undefined> {
    return await this.userService.updateUserName(userId, updateUserNameDto);
  }

  @Patch('/:userId/password')
  @UseGuards(JwtAuthGuard, IsUserSelfGuard) // IsUserSelfGuard로 로그인 한 사용자가 파라미터 userId와 같아야만 요청 가능
  async updatePassword(
    @Param('userId') userId,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserEntity | undefined> {
    const oldPassword = updatePasswordDto.oldPassword;
    const newPassword = updatePasswordDto.newPassword;
    return await this.userService.updatePassword(
      userId,
      oldPassword,
      newPassword,
    );
  }
}
