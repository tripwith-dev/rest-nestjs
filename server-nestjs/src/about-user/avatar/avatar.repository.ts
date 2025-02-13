import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { AvatarEntity } from './avatar.entity';
import { CreateAvatarDto } from './dtos/avatar.create.dto';
import { UpdateIntroduceDto } from './dtos/introduce.update.dto';
import { UpdateNicknameDto } from './dtos/nickname.update.dto';

@Injectable()
export class AvatarRepository {
  constructor(
    @InjectRepository(AvatarEntity)
    private readonly repository: Repository<AvatarEntity>,
  ) {}

  /** <주의>
   * 모든 사용자에 대한 프로필 가져옴
   */
  async findAllAvatars(): Promise<AvatarEntity[]> {
    return await this.repository.find({ where: { isDeleted: false } });
  }

  /**
   * 사용자 페이지에서 사용됨.
   * 프로필(아바타)에 대한 모든 정보를 반환함
   */
  async findAvatarWithCategoryByAvatarId(
    avatarId: number,
  ): Promise<AvatarEntity> {
    const avatar = await this.repository
      .createQueryBuilder('avatar')
      .leftJoinAndSelect('avatar.categories', 'category')
      .where('avatar.avatarId = :avatarId', { avatarId })
      .andWhere('avatar.isDeleted = false')
      .getOne();

    return avatar;
  }

  /**
   * 프로필 정보만 조회
   */
  async findAvatarById(avatarId: number): Promise<AvatarEntity> {
    const avatar = await this.repository
      .createQueryBuilder('avatar')
      .where('avatar.avatarId = :avatarId', { avatarId })
      .andWhere('avatar.isDeleted = false')
      .getOne();

    return avatar;
  }

  async findAvatarWithLikePlansByAvatarId(
    avatarId: number,
  ): Promise<AvatarEntity> {
    const avatar = await this.repository
      .createQueryBuilder('avatar')
      .leftJoinAndSelect('avatar.likePlans', 'likePlans')
      .where('avatar.avatarId = :avatarId', { avatarId })
      .andWhere('avatar.isDeleted = false')
      .getOne();

    return avatar;
  }

  /**
   * avatar 생성
   */
  async createAvatar(
    createAvatarDto: CreateAvatarDto,
    user: UserEntity,
  ): Promise<AvatarEntity> {
    const avatar = this.repository.create({
      ...createAvatarDto,
      user,
    });
    const createdAvatar = await this.repository.save(avatar);
    return createdAvatar;
  }

  /**
   * 주어진 닉네임이 데이터베이스에 존재하는지 확인.
   * 닉네임 존재 여부를 반환 (true: 존재, false: 미존재)
   */
  async existsByNickname(nickname: string): Promise<boolean> {
    const avatar = await this.repository
      .createQueryBuilder('avatar')
      .where('avatar.nickname = :nickname', { nickname: nickname })
      .andWhere('avatar.isDeleted = false')
      .getOne();

    return !!avatar;
  }

  async updateNickname(
    avatarId: number,
    updateNicknameDto: UpdateNicknameDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(avatarId, {
      ...updateNicknameDto,
      isUpdated: true,
      updatedAt: new Date(),
    });
  }

  async updateIntroduce(
    avatarId: number,
    updateIntroduceDto: UpdateIntroduceDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(avatarId, {
      ...updateIntroduceDto,
      isUpdated: true,
      updatedAt: new Date(),
    });
  }

  /**
   * 사용자 프로필 이미지 교체(addProfileImage로 대체)
   * @param userId 사용자 ID
   * @param newProfileImageUrl 새로운 프로필 이미지 URL
   * @returns 업데이트된 사용자 엔티티
   * @throws HttpException 사용자를 찾을 수 없는 경우
   */
  async replaceProfileImage(
    avatarId: number,
    newProfileImageUrl: string,
  ): Promise<UpdateResult> {
    const result = await this.repository
      .createQueryBuilder()
      .update(AvatarEntity)
      .set({ profileImage: newProfileImageUrl })
      .where('avatarId = :avatarId', { avatarId })
      .execute();

    return result;
  }

  /**
   * 기존 프로필 이미지 파일 삭제
   * @param avatar 사용자 엔티티
   */
  async removeProfileImage(avatar: AvatarEntity): Promise<void> {
    const defaultImagePath = 'uploads/profileImages/default.png';

    if (avatar.profileImage && avatar.profileImage !== defaultImagePath) {
      const filePath = path.join(__dirname, '..', avatar.profileImage);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  /**
   * 프로필 이미지를 기본 이미지로 변경
   * @param avatarId 사용자 ID
   * @returns 업데이트 결과
   */
  async updateProfileImageToDefault(avatarId: number): Promise<UpdateResult> {
    return await this.repository
      .createQueryBuilder()
      .update(AvatarEntity)
      .set({ profileImage: 'uploads/profileImages/default.png' })
      .where('avatarId = :avatarId', { avatarId })
      .execute();
  }
}
