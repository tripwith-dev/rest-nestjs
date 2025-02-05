import { Injectable, NotFoundException } from '@nestjs/common';
import { timeSince } from 'src/utils/timeSince';
import { UserEntity } from '../user/user.entity';
import { AvatarEntity } from './avatar.entity';
import { AvatarRepository } from './avatar.repository';
import { CreateAvatarDto } from './dtos/avatar.create.dto';

@Injectable()
export class AvatarService {
  constructor(private readonly avatarRepository: AvatarRepository) {}

  async findAvatarById(avatarId: number): Promise<AvatarEntity | undefined> {
    const avatar = await this.avatarRepository.findAvatarById(avatarId);

    if (!avatar) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    // createdTimeSince 적용 후 반환
    return {
      ...avatar,
      createdTimeSince: timeSince(avatar.createdAt),
    };
  }

  async existsByNickname(nickname: string): Promise<boolean> {
    return await this.avatarRepository.existsByNickname(nickname);
  }

  async createAvatar(
    createAvatarDto: CreateAvatarDto,
    user: UserEntity,
  ): Promise<AvatarEntity> {
    return await this.avatarRepository.createAvatar(createAvatarDto, user);
  }
}
