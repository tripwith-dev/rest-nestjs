import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  validatePassword,
  validateUsername,
} from 'src/utils/validateUserInput';
import { RegisterUserDto } from './dtos/user.register.req.dto';
import { UpdateUserNameDto } from './dtos/username.update.dto';
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
  async findUserWithAvatarByUserId(
    userId: number,
  ): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findUserWithAvatarByUserId(userId);

    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  /**
   * 사용자 계정 정보에서 사용됨
   * email, 이름 등 계정 정보 조회
   */
  async findUserById(userId: number): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
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

  async updateUserName(
    userId: number,
    updateUserNameDto: UpdateUserNameDto,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    validateUsername(updateUserNameDto.username);

    if (user.username === updateUserNameDto.username) {
      throw new BadRequestException('동일한 이름으로 변경할 수 없습니다.');
    }

    await this.userRepository.updateUserName(userId, updateUserNameDto);
    return await this.findUserById(userId);
  }

  async updatePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    validatePassword(newPassword);

    // 기존 비밀번호 확인
    const checkOldPassword = await this.checkPassword(user.email, oldPassword);

    if (!checkOldPassword) {
      throw new UnauthorizedException('기존 비밀번호가 일치하지 않습니다.');
    }

    // 비밀번호 업데이트 처리
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await this.userRepository.updatePassword(
        user.id,
        hashedPassword,
      );

      if (!updatedUser) {
        throw new InternalServerErrorException(
          '비밀번호 업데이트에 실패했습니다.',
        );
      }

      return await this.findUserById(userId);
    } catch (error) {
      throw new InternalServerErrorException(
        '비밀번호 업데이트 중 오류가 발생했습니다.',
      );
    }
  }

  /**
   * 비밀번호 체크
   * @param user 사용자 계정 정보
   * @param password 비밀번호
   * @returns 비밀번호 일치 여부 (true/false)
   */
  private async checkPassword(
    email: string,
    password: string,
  ): Promise<boolean> {
    const userAllInfo = await this.userRepository.findUserByEmail(email);
    return await bcrypt.compare(password, userAllInfo.password);
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
