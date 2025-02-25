import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { validateNickname } from 'src/utils/validateUserInput';
import { UpdateResult } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { AvatarEntity } from './avatar.entity';
import { AvatarRepository } from './avatar.repository';
import { CreateAvatarDto } from './dtos/avatar.create.dto';
import { UpdateIntroduceDto } from './dtos/introduce.update.dto';
import { UpdateNicknameDto } from './dtos/nickname.update.dto';

@Injectable()
export class AvatarService {
  constructor(private readonly avatarRepository: AvatarRepository) {}

  // ============================================================
  // =========================== MAIN ===========================
  // ============================================================

  /**
   * 회원가입 시에 사용됨
   */
  async createAvatar(
    createAvatarDto: CreateAvatarDto,
    user: UserEntity,
  ): Promise<AvatarEntity> {
    return await this.avatarRepository.createAvatar(createAvatarDto, user);
  }

  /**
   * 사용자 페이지에서 사용됨.
   * 사용자가 생성한 카테고리도 같이 볼 수 있음.
   * 다른 사람도 볼 수 있는 기본 정보만 리턴.
   */
  async findAvatarWithCategoryByAvatarId(
    avatarId: number,
  ): Promise<AvatarEntity | undefined> {
    const avatar =
      await this.avatarRepository.findAvatarWithCategoryByAvatarId(avatarId);

    if (!avatar) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return avatar;
  }

  async findAvatarById(avatarId: number): Promise<AvatarEntity | undefined> {
    const avatar = await this.avatarRepository.findAvatarById(avatarId);

    if (!avatar) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return avatar;
  }

  async findAvatarWithLikePlansByAvatarId(
    avatarId: number,
  ): Promise<AvatarEntity | undefined> {
    const avatar =
      await this.avatarRepository.findAvatarWithLikePlansByAvatarId(avatarId);

    if (!avatar) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return avatar;
  }

  async updateNickname(
    avatarId: number,
    updateNicknameDto: UpdateNicknameDto,
  ): Promise<AvatarEntity | undefined> {
    const avatar = await this.findAvatarById(avatarId);

    // 닉네임 중복 확인 및 유효성 검증
    await this.existsByNickname(updateNicknameDto.nickname);
    validateNickname(updateNicknameDto.nickname);

    await this.avatarRepository.updateNickname(
      avatar.avatarId,
      updateNicknameDto,
    );
    return await this.findAvatarById(avatarId);
  }

  async updateIntroduce(
    avatarId: number,
    updateIntroduceDto: UpdateIntroduceDto,
  ): Promise<AvatarEntity | undefined> {
    const avatar = await this.findAvatarById(avatarId);

    await this.avatarRepository.updateIntroduce(
      avatar.avatarId,
      updateIntroduceDto,
    );
    return await this.findAvatarById(avatarId);
  }

  /**
   * 사용자 프로필 이미지 교체
   * @param userId 사용자 ID
   * @param newProfileImageUrl 새로운 프로필 이미지 URL
   * @returns 업데이트된 사용자 엔티티
   * @throws NotFoundException 사용자를 찾을 수 없는 경우
   */
  async replaceProfileImage(
    avatarId: number,
    newProfileImagePath: string,
  ): Promise<AvatarEntity> {
    const avatar = await this.findAvatarById(avatarId);

    await this.avatarRepository.replaceProfileImage(
      avatar.avatarId,
      newProfileImagePath,
    );
    return await this.findAvatarById(avatarId);
  }

  /**
   * 사용자 프로필 이미지 삭제
   * @param userId 사용자 ID
   * @returns 업데이트된 사용자 엔티티
   * @throws NotFoundException 사용자를 찾을 수 없는 경우
   */
  async deleteProfileImage(avatarId: number): Promise<AvatarEntity> {
    const avatar = await this.findAvatarById(avatarId);

    await this.avatarRepository.removeProfileImage(avatar);
    await this.avatarRepository.updateProfileImageToDefault(avatar.avatarId);

    return await this.findAvatarById(avatarId);
  }

  async softDeleteAvatar(avatarId: number): Promise<UpdateResult> {
    const avatar = await this.findAvatarById(avatarId);
    return await this.avatarRepository.softDeleteAvatar(avatar.avatarId);
  }

  // ===========================================================
  // =========================== SUB ===========================
  // ===========================================================

  /**
   * 닉네임 검증
   * 회원가입, 닉네임 수정 시에 사용됨
   */
  async existsByNickname(nickname: string): Promise<void> {
    const isNicknameExist =
      await this.avatarRepository.existsByNickname(nickname);
    if (isNicknameExist) {
      throw new UnauthorizedException('이미 존재하는 닉네임입니다.');
    }
  }
}
