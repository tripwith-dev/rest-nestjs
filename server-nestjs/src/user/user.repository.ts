import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
   * 사용자 페이지에서 사용됨.
   * 사용자가 생성한 카테고리도 같이 볼 수 있음.
   * 다른 사람도 볼 수 있는 기본 정보만 리턴.
   */
  async findUserWithCategoryByUserId(userId): Promise<UserEntity> {
    return await this.repository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.travelCategories', 'category')
      .where('user.id = :userId', { userId: userId })
      .andWhere('user.isDeleted = false')
      .select([
        'user.id',
        'user.profileImage',
        'user.nickname',
        'user.introduce',
        'user.createdAt',
        'category.categoryId',
        'category.categoryTitle',
      ])
      .getOne();
  }

  /**
   * 사용자 패스워드를 제외한 모든 정보 가져옴.
   */
  async findUserByUserId(userId): Promise<UserEntity> {
    return await this.repository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId: userId })
      .andWhere('user.isDeleted = false')
      .getOne();
  }
}
