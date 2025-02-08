import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { timeSince } from 'src/utils/timeSince';
import { validateNickname } from 'src/utils/validateUserInput';
import { UserEntity } from '../user/user.entity';
import { AvatarEntity } from './avatar.entity';
import { AvatarRepository } from './avatar.repository';
import { CreateAvatarDto } from './dtos/avatar.create.dto';
import { UpdateIntroduceDto } from './dtos/introduce.update.dto';
import { UpdateNicknameDto } from './dtos/nickname.update.dto';

@Injectable()
export class AvatarService {
  constructor(private readonly avatarRepository: AvatarRepository) {}

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

    // createdTimeSince 적용 후 반환
    return {
      ...avatar,
      createdTimeSince: timeSince(avatar.createdAt),
    };
  }

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

  /**
   * 닉네임 검증
   * 회원가입, 닉네임 수정 시에 사용됨
   */
  async existsByNickname(nickname: string): Promise<boolean> {
    return await this.avatarRepository.existsByNickname(nickname);
  }

  /**
   * 회원가입 시에 사용됨
   */
  async createAvatar(
    createAvatarDto: CreateAvatarDto,
    user: UserEntity,
  ): Promise<AvatarEntity> {
    return await this.avatarRepository.createAvatar(createAvatarDto, user);
  }

  async updateNickname(
    avatarId: number,
    updateNicknameDto: UpdateNicknameDto,
  ): Promise<AvatarEntity | undefined> {
    const avatar = await this.findAvatarById(avatarId);

    validateNickname(updateNicknameDto.nickname);

    if (avatar.nickname === updateNicknameDto.nickname) {
      throw new BadRequestException('동일한 닉네임으로 변경할 수 없습니다.');
    }

    const isNicknameExist = await this.existsByNickname(
      updateNicknameDto.nickname,
    );
    if (isNicknameExist) {
      throw new UnauthorizedException('이미 존재하는 닉네임입니다.');
    }

    await this.avatarRepository.updateNickname(avatarId, updateNicknameDto);
    return await this.findAvatarById(avatarId);
  }

  async updateIntroduce(
    avatarId: number,
    updateIntroduceDto: UpdateIntroduceDto,
  ): Promise<AvatarEntity | undefined> {
    const avatar = await this.findAvatarById(avatarId);

    if (avatar) {
      await this.avatarRepository.updateIntroduce(avatarId, updateIntroduceDto);
      return await this.findAvatarById(avatarId);
    }
  }
}
