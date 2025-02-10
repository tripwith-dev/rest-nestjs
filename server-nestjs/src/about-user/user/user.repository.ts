import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterUserDto } from './dtos/user.register.req.dto';
import { UpdateUserNameDto } from './dtos/username.update.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  /** <주의>
   * 모든 사용자에 대한
   * 모든 정보 가져옴
   */
  async findAllUsers(): Promise<UserEntity[]> {
    return await this.repository.find({ where: { isDeleted: false } });
  }

  /**
   * 사용자 패스워드를 제외한 모든 정보 가져옴.
   */
  async findUserWithAvatarByUserId(userId): Promise<UserEntity> {
    return await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar')
      .where('user.id = :userId', { userId: userId })
      .andWhere('user.isDeleted = false')
      .getOne();
  }

  /**
   * 사용자 패스워드를 제외한 모든 정보 가져옴.
   */
  async findUserById(userId): Promise<UserEntity> {
    return await this.repository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId: userId })
      .andWhere('user.isDeleted = false')
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
      .leftJoinAndSelect('user.avatar', 'avatar')
      .where('user.id = :sub', { sub })
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
      .where('user.email = :email', { email: email })
      .andWhere('user.isDeleted = false')
      .getOne();

    return !!user;
  }

  /**
   * 사용자 서브 정보로 유효성 검사를 위한 사용자 조회
   * 이메일로 유저 조회 (비밀번호 포함)
   */
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.repository
      .createQueryBuilder('user')
      .addSelect('user.password') // password 필드를 명시적으로 선택
      .where('user.email = :email', { email })
      .andWhere('user.isDeleted = false')
      .getOne();
  }

  /**
   * 주어진 닉네임이 데이터베이스에 존재하는지 확인.
   * 닉네임 존재 여부를 반환 (true: 존재, false: 미존재)
   */
  async existsByNickname(nickname: string): Promise<boolean> {
    const user = await this.repository
      .createQueryBuilder('user')
      .where('user.nickname = :nickname', { nickname: nickname })
      .andWhere('user.isDeleted = false')
      .getOne();

    return !!user;
  }

  async updateUserName(
    userId: number,
    updateUserName: UpdateUserNameDto,
  ): Promise<void> {
    await this.repository.update(userId, {
      ...updateUserName,
      isUpdated: true,
      updatedAt: new Date(),
    });
  }
}
