import {
  BadRequestException,
  Injectable,
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

  // ============================================================
  // =========================== MAIN ===========================
  // ============================================================

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
    const createdUser = await this.userRepository.createUser(userRegisterDto);

    if (!createdUser) {
      throw new BadRequestException('회원가입에 실패하였습니다.');
    }

    return await this.findUserById(createdUser.id);
  }

  async updateUserName(
    userId: number,
    updateUserNameDto: UpdateUserNameDto,
  ): Promise<UserEntity> {
    const user = await this.findUserById(userId);

    validateUsername(updateUserNameDto.username);

    await this.userRepository.updateUserName(user.id, updateUserNameDto);
    return await this.findUserById(userId);
  }

  async updatePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ): Promise<UpdateResult> {
    const user = await this.findUserById(userId);
    const userWithPassword = await this.findUserByEmail(user.email);

    // 1. 기존 비밀번호 확인
    await this.checkPassword(userWithPassword.password, oldPassword);

    // 2. 새 패스워드 유효성 검증
    validatePassword(newPassword);

    // 비밀번호 업데이트 처리
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await this.userRepository.updatePassword(user.id, hashedPassword);
  }

  async softDeleteUser(userId: number): Promise<UpdateResult> {
    const user = await this.findUserById(userId);
    return await this.userRepository.softDeleteUser(user.id);
  }

  // ===========================================================
  // =========================== SUB ===========================
  // ===========================================================

  async existsByEmail(email: string): Promise<void> {
    const isEmailExist = await this.userRepository.existsByEmail(email);
    if (isEmailExist) {
      throw new UnauthorizedException('이미 존재하는 이메일입니다.');
    }
  }

  async findUserAllInfo(userId: number): Promise<UserEntity> {
    const user = await this.userRepository.findUserAllInfo(userId);

    if (!user) {
      throw new NotFoundException('해당하는 사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  /**
   * 실제 패스워드와 입력받은 기존 패스워드 비교함
   * @param realUserPassword
   * @param inputOldPassword
   */
  private async checkPassword(
    realUserPassword: string,
    inputOldPassword: string,
  ): Promise<void> {
    const isCorrect = await bcrypt.compare(inputOldPassword, realUserPassword);
    if (!isCorrect) {
      throw new UnauthorizedException('기존 패스워드가 틀렸습니다.');
    }
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
