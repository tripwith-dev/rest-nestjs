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
import { UpdateResult } from 'typeorm';
import { RegisterUserDto } from './dtos/user.register.req.dto';
import { UpdateUserNameDto } from './dtos/username.update.dto';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  // =========================== MAIN ===========================

  async findUserById(userId: number): Promise<UserEntity | undefined> {
    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  /**
   * user와 avatar를 같이 반환함.
   * req.user에 avatar 정보도 같이 전달하기 위해서 사용됨.
   * @param userId
   * @returns
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

    // 기존 비밀번호 확인
    const checkOldPassword = await this.checkPassword(user.email, oldPassword);

    if (!checkOldPassword) {
      throw new UnauthorizedException('기존 비밀번호가 일치하지 않습니다.');
    }

    validatePassword(newPassword);

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

  async softDeleteUser(userId: number): Promise<UpdateResult> {
    const user = await this.findUserById(userId);
    return await this.userRepository.softDeleteUser(user.id);
  }

  // =========================== SUB ===========================

  async existsByEmail(email: string) {
    return await this.userRepository.existsByEmail(email);
  }

  async findUserAllInfo(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findUserAllInfo(userId);

    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  /**
   * 사용자 email을 통해 진짜 password를 조회 후 비교
   * @param email
   * @param password
   * @returns
   */
  private async checkPassword(
    email: string,
    password: string,
  ): Promise<boolean> {
    const userAllInfo = await this.findUserByEmail(email);
    return await bcrypt.compare(password, userAllInfo.password);
  }

  /**
   * 사용자 서브 정보로 유효성 검사를 위한 사용자 조회
   */
  async validateUserBySub(sub: string): Promise<UserEntity> {
    // 이 user가 req.user
    const user = await this.userRepository.validateUserBySub(sub);

    if (!user) {
      throw new NotFoundException('인증 실패: 사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  /**
   * 사용자 서브 정보로 유효성 검사를 위한 사용자 조회
   * 이메일로 유저 조회, password도 같이 조회하므로 주의
   * @param email
   * @returns
   */
  async findUserByEmail(email: string): Promise<any | null> {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
  }
}
