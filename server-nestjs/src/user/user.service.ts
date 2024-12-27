import { Injectable, NotFoundException } from '@nestjs/common';
import { timeSince } from 'src/utils/timeSince';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * 사용자 페이지에서 사용됨.
   * 사용자가 생성한 카테고리도 같이 볼 수 있음.
   * 다른 사람도 볼 수 있는 기본 정보만 리턴.
   */
  async findUserByUserId(userId: number): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findUserByUserId(userId);

    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    // createdTimeSince 적용 후 반환
    return {
      ...user,
      createdTimeSince: timeSince(user.createdAt),
    };
  }

  /**
   * 사용자 페이지에서 사용됨.
   * 사용자가 생성한 카테고리도 같이 볼 수 있음.
   * 다른 사람도 볼 수 있는 기본 정보만 리턴.
   */
  async findUserWithCategoryByUserId(
    userId: number,
  ): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findUserWithCategoryByUserId(userId);

    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    // createdTimeSince 적용 후 반환
    return {
      ...user,
      createdTimeSince: timeSince(user.createdAt),
    };
  }
}
