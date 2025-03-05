import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { CreateCategoryDto } from './dtos/category.create.dto';
import { UpdateCategoryDto } from './dtos/category.update.dto';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repository: Repository<CategoryEntity>,
  ) {}

  /**
   * 여행 카테고리를 생성하는 리포지토리 로직
   * @param user 사용자 엔티티
   * @param createTravelCategoryDto 여행 카테고리 생성 DTO
   * @returns 생성된 여행 카테고리 엔티티를 반환
   */
  async createCategory(
    avatar: AvatarEntity,
    createTravelCategoryDto: CreateCategoryDto,
  ): Promise<CategoryEntity> {
    const travelCategory = this.repository.create({
      ...createTravelCategoryDto,
      avatar,
    });
    return await this.repository.save(travelCategory);
  }

  async findCategoryById(categoryId: number): Promise<CategoryEntity> {
    const travelCategory = await this.repository
      .createQueryBuilder('category')
      .where('category.categoryId = :categoryId', { categoryId })
      .andWhere('category.isDeleted = false')
      .getOne();

    return travelCategory;
  }

  async findCategoryWithAvatar(categoryId: number): Promise<CategoryEntity> {
    return await this.repository
      .createQueryBuilder('category')
      .where('category.categoryId = :categoryId', { categoryId })
      .leftJoinAndSelect(
        'category.avatar',
        'avatar',
        'avatar.isDeleted = false',
      )
      .andWhere('category.isDeleted = false')
      .getOne();
  }

  async findCategoriesByAvatarId(avatarId: number): Promise<CategoryEntity[]> {
    return await this.repository
      .createQueryBuilder('category')
      .where('avatar.avatarId = :avatarId', { avatarId })
      .leftJoin('category.avatar', 'avatar', 'avatar.isDeleted = false')
      .andWhere('category.isDeleted = false')
      .getMany();
  }

  /**
   * 특정 여행 카테고리를 업데이트하는 리포지토리 로직
   * @param categoryId - 카테고리 ID
   * @param updateTravelCategoryDto - 업데이트할 정보 DTO
   * @returns void
   */
  async updateCategory(
    categoryId: number,
    updateTravelCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(categoryId, {
      ...updateTravelCategoryDto,
      updatedAt: new Date(),
    });
  }

  /**
   * 특정 여행 컨테이너를 소프트 삭제하는 리포지토리 로직
   * @param containerId 여행 컨테이너 ID
   * @returns void
   */
  async softDeletedCategory(categoryId: number): Promise<UpdateResult> {
    return await this.repository.update(categoryId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }

  /**
   * 특정 avatar에 속한 모든 category를 소프트 삭제하는 리포지토리 로직
   * @param avatarId 아바타 ID
   * @returns UpdateResult
   */
  async softDeleteCategoriesByAvatar(avatarId: number): Promise<UpdateResult> {
    return await this.repository
      .createQueryBuilder()
      .update(CategoryEntity)
      .set({
        isDeleted: true,
        deletedAt: new Date(),
      })
      .where('avatarId = :avatarId', { avatarId })
      .execute();
  }
}
