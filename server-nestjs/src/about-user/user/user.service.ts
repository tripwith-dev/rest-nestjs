import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { timeSince } from 'src/utils/timeSince';
import { RegisterUserDto } from './dtos/user.register.req.dto';
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
  async findUserById(userId: number): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    // createdTimeSince 적용 후 반환
    return {
      ...user,
      createdTimeSince: timeSince(user.createdAt),
      avatar: {
        ...user.avatar,
        createdTimeSince: timeSince(user.avatar.createdAt),
      },
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

  /**
   * user 생성
   */
  async createUser(userRegisterDto: RegisterUserDto): Promise<UserEntity> {
    try {
      const createdUser = await this.userRepository.createUser(userRegisterDto);

      if (!createdUser) {
        throw new BadRequestException('회원가입에 실패하였습니다.');
      }

      return await this.findUserById(createdUser.id);
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('회원가입 처리 중 오류가 발생했습니다.');
    }
  }

  /**
   * 사용자 서브 정보로 유효성 검사를 위한 사용자 조회
   */
  async validateUserBySub(sub: string): Promise<UserEntity> {
    const user = await this.userRepository.validateUserBySub(sub);

    if (!user) {
      throw new NotFoundException('인증 실패: 사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  /**
   * 사용자 서브 정보로 유효성 검사를 위한 사용자 조회
   * 이메일로 유저 조회
   */
  async findUserByEmail(email: string): Promise<any | null> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
  }
}
