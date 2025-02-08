import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { IsAvatarSelfGuard } from '../jwt/avatar.self.guard';
import { JwtAuthGuard } from '../jwt/jwt.guard';
import { AvatarEntity } from './avatar.entity';
import { AvatarService } from './avatar.service';
import { UpdateIntroduceDto } from './dtos/introduce.update.dto';
import { UpdateNicknameDto } from './dtos/nickname.update.dto';

@Controller('avatars')
export class AvatarController {
  constructor(private readonly avatarService: AvatarService) {}

  /**
   * 사용자 페이지에서 사용됨.
   * 사용자가 생성한 카테고리도 같이 볼 수 있음.
   * 다른 사람도 볼 수 있는 기본 정보만 리턴.
   */
  @Get(':avatarId')
  async findAvatarWithCategoryByAvatarId(
    @Param('avatarId') avatarId,
  ): Promise<AvatarEntity | undefined> {
    return await this.avatarService.findAvatarWithCategoryByAvatarId(avatarId);
  }

  /**
   * 사용자 프로필 설정 페이지에서 사용됨.
   */
  @Get(':avatarId/profile')
  @UseGuards(JwtAuthGuard, IsAvatarSelfGuard)
  async findAvatarById(
    @Param('avatarId') avatarId,
  ): Promise<AvatarEntity | undefined> {
    return await this.avatarService.findAvatarById(avatarId);
  }

  /**
   * 사용자 프로필 설정 페이지에서 사용됨.
   */
  @Get(':avatarId/like-plans')
  @UseGuards(JwtAuthGuard, IsAvatarSelfGuard)
  async findAvatarWithLikePlansByAvatarId(
    @Param('avatarId') avatarId,
  ): Promise<AvatarEntity | undefined> {
    return await this.avatarService.findAvatarWithLikePlansByAvatarId(avatarId);
  }

  @Patch(':avatarId/nickname')
  @UseGuards(JwtAuthGuard, IsAvatarSelfGuard)
  async updateNickname(
    @Param('avatarId') avatarId,
    @Body() updateNicknameDto: UpdateNicknameDto,
  ): Promise<AvatarEntity | undefined> {
    return await this.avatarService.updateNickname(avatarId, updateNicknameDto);
  }

  @Patch(':avatarId/introduce')
  @UseGuards(JwtAuthGuard, IsAvatarSelfGuard)
  async updateIntroduce(
    @Param('avatarId') avatarId,
    @Body() updateIntroduceDto: UpdateIntroduceDto,
  ): Promise<AvatarEntity | undefined> {
    return await this.avatarService.updateIntroduce(
      avatarId,
      updateIntroduceDto,
    );
  }
}
