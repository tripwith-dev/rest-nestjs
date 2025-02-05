import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { AvatarEntity } from './avatar.entity';
import { CreateAvatarDto } from './dtos/avatar.create.dto';

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
    return await this.repository
      .createQueryBuilder('avatar')
      .leftJoinAndSelect('avatar.categories', 'category')
      .where('avatar.avatarId = :avatarId', { avatarId: avatarId })
      .andWhere('avatar.isDeleted = false')
      .select([
        'avatar.avatarId',
        'avatar.profileImage',
        'avatar.nickname',
        'avatar.introduce',
        'avatar.createdAt',
        'avatar.createdTimeSince',
        'category.categoryId',
        'category.categoryTitle',
      ])
      .getOne();
  }

  /**
   * 프로필 정보만 조회
   */
  async findAvatarById(avatarId: number): Promise<AvatarEntity> {
    return await this.repository
      .createQueryBuilder('avatar')
      .where('avatar.avatarId = :avatarId', { avatarId: avatarId })
      .andWhere('avatar.isDeleted = false')
      .getOne();
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
      user, // Associate user with the avatar
    });
    return await this.repository.save(avatar);
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
}
