import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { RegisterUserDto } from './dtos/user.register.req.dto';
import { UpdateUserNameDto } from './dtos/username.update.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  /**
   * 사용자 패스워드를 제외한 모든 정보 가져옴.
   */
  async findUserById(userId: number): Promise<UserEntity> {
    const user = await this.repository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .andWhere('user.isDeleted = false')
      .getOne();

    return user;
  }

  async findUserWithAvatar(userId: number): Promise<UserEntity> {
    return await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar', 'avatar.isDeleted = false')
      .where('user.id = :userId', { userId })
      .andWhere('user.isDeleted = false')
      .andWhere('avatar.isDeleted = false')
      .getOne();
  }

  /**
   * 사용자 서브 정보로 유효성 검사를 위해 사용자를 조회하는 서비스 로직.
   * 로그인 시에 사용됨.
   * @param sub 사용자 서브 정보.
   * @returns 주어진 서브 정보를 가진 사용자 객체를 반환.
   */
  async validateUserBySub(sub: string): Promise<UserEntity | undefined> {
    return await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar', 'avatar.isDeleted = false')
      .where('user.id = :sub', { sub })
      .andWhere('user.isDeleted = false')
      .andWhere('avatar.isDeleted = false')
      .getOne();
  }

  /**
   * user 생성
   */
  async createUser(userRegisterDto: RegisterUserDto): Promise<UserEntity> {
    const user = this.repository.create(userRegisterDto);
    return await this.repository.save(user);
  }

  /**
   * 주어진 이메일 데이터베이스에 존재하는지 확인.
   * 이메일 존재 여부를 반환 (true: 존재, false: 미존재)
   */
  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.repository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .andWhere('user.isDeleted = false')
      .getOne();

    return !!user;
  }

  /**
   * 사용자 서브 정보로 유효성 검사를 위한 사용자 조회
   * 이메일로 유저 조회 (비밀번호 포함)
   */
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.repository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .andWhere('user.isDeleted = false')
      .getOne();

    return user;
  }

  async updateUserName(
    userId: number,
    updateUserName: UpdateUserNameDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(userId, {
      ...updateUserName,
      updatedAt: new Date(),
    });
  }

  /**
   * user 객체의 password 업데이트
   * @param userAllInfo 업데이트할 사용자 정보
   * @param hashedPassword 해싱된 새로운 비밀번호
   * @returns 업데이트된 사용자 정보를 나타내는 객체
   */
  async updatePassword(
    userId: number,
    hashedPassword: string,
  ): Promise<UpdateResult> {
    return await this.repository.update(userId, {
      password: hashedPassword,
      updatedAt: new Date(),
    });
  }

  async softDeleteUser(userId: number): Promise<UpdateResult> {
    return await this.repository.update(userId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }
}
