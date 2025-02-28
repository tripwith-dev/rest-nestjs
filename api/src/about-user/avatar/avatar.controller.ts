import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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
   * 사용자의 프로필 정보를 반환
   * 카테고리, public 플랜(본인이면 private도 포함), 게시글, 댓글 등
   * @param avatarId
   * @param req
   * @returns
   */
  @Get(':avatarId')
  async findAvatarWithCategories(
    @Param('avatarId') avatarId,
  ): Promise<AvatarEntity | undefined> {
    return await this.avatarService.findAvatarWithCategories(avatarId);
  }

  /**
   * 프로필 설정 페이지에서 사용자는 본인의 프로필(avatar) 정보를 조회할 수 있어야 한다.
   * findAvatarWithCategoryByAvatarId는 카테고리 정보까지 조회하기 때문에
   * 프로필 정보만 조회하는 엔드포인트가 필요하다.
   * IsAvatarSelfGuard로 로그인 한 사용자가 파라미터 avatarId와 같아야만 요청 가능
   * @param avatarId
   * @returns
   */
  @Get(':avatarId/profile')
  @UseGuards(JwtAuthGuard, IsAvatarSelfGuard) // IsAvatarSelfGuard로 로그인 한 사용자가 파라미터 userId와 같아야만 요청 가능
  async findAvatarById(
    @Param('avatarId') avatarId,
  ): Promise<AvatarEntity | undefined> {
    return await this.avatarService.findAvatarById(avatarId);
  }

  /**
   * 사용자가 좋아요를 누를 plan들을 조회할 수 있어야 한다.
   * plan이 PRIVATE일 경우에는 조회할 수 없다.
   * IsAvatarSelfGuard로 로그인 한 사용자가 파라미터 avatarId와 같아야만 요청 가능
   * @param avatarId
   * @returns
   */
  @Get(':avatarId/like-plans')
  @UseGuards(JwtAuthGuard, IsAvatarSelfGuard)
  async findAvatarWithLikePlansByAvatarId(
    @Param('avatarId') avatarId,
  ): Promise<AvatarEntity | undefined> {
    return await this.avatarService.findAvatarWithLikePlansByAvatarId(avatarId);
  }

  /**
   * 사용자는 본인의 닉네임을 수정할 수 있어야 한다.
   * IsAvatarSelfGuard로 로그인 한 사용자가 파라미터 avatarId와 같아야만 요청 가능
   * @param avatarId
   * @param updateNicknameDto
   * @returns
   */
  @Patch(':avatarId/nickname')
  @UseGuards(JwtAuthGuard, IsAvatarSelfGuard)
  async updateNickname(
    @Param('avatarId') avatarId,
    @Body() updateNicknameDto: UpdateNicknameDto,
  ): Promise<AvatarEntity | undefined> {
    return await this.avatarService.updateNickname(avatarId, updateNicknameDto);
  }

  /**
   * 사용자는 본인의 자기소개를 수정할 수 있어야 한다.
   * IsAvatarSelfGuard로 로그인 한 사용자가 파라미터 avatarId와 같아야만 요청 가능
   * @param avatarId
   * @param updateIntroduceDto
   * @returns
   */
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

  /**
   * 사용자는 본인의 프로필 이미지를 교체할 수 있어야 한다.
   *  IsAvatarSelfGuard로 로그인 한 사용자가 파라미터 avatarId와 같아야만 요청 가능
   * @param avatarId 사용자 ID
   * @param updateUserProfileImageDto 새로운 프로필 이미지 URL
   * @returns 업데이트된 사용자 엔티티
   */
  @Patch(':avatarId/profileImage')
  @UseInterceptors(FileInterceptor('file'))
  @UseGuards(JwtAuthGuard, IsAvatarSelfGuard)
  async replaceProfileImage(
    @Param('avatarId') avatarId: number,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<AvatarEntity> {
    if (!file) {
      throw new HttpException(
        '새로운 프로필 이미지가 업로드되지 않았습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newProfileImagePath = file.path;
    if (!newProfileImagePath) {
      throw new HttpException(
        '저장 경로를 찾을 수 없습니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.avatarService.replaceProfileImage(
      avatarId,
      newProfileImagePath,
    );
  }

  /**
   * 사용자는 본인의 프로필 이미지를 삭제할 수 있어야 한다.
   * @param avatarId
   * @returns
   */
  @Delete(':avatarId/profileImage')
  @UseGuards(JwtAuthGuard, IsAvatarSelfGuard)
  async deleteProfileImage(
    @Param('avatarId') avatarId: number,
  ): Promise<AvatarEntity> {
    return await this.avatarService.deleteProfileImage(avatarId);
  }
}
