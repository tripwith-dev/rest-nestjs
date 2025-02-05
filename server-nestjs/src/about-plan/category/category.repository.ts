import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { timeSince } from 'src/utils/timeSince';
import { Repository } from 'typeorm';
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
      .leftJoinAndSelect('category.user', 'user')
      .leftJoinAndSelect('plan.destinations', 'planDestinations')
      .leftJoinAndSelect('planDestinations.destination', 'destination')
      .addSelect(['user.id'])
      .where('category.categoryId = :categoryId', { categoryId })
      .andWhere('category.isDeleted = false')
      .getOne();

    if (travelCategory) {
      // travelCategory의 createdTimeSince 필드를 변환
      const transformedTravelCategory = {
        ...travelCategory,
        createdTimeSince: timeSince(travelCategory.createdAt),
      };

      return transformedTravelCategory;
    }

    return null;
  }

  async findCategoryWithPlansByCategoryId(
    categoryId: number,
  ): Promise<CategoryEntity> {
    const travelCategory = await this.repository
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.plans', 'plan')
      .leftJoinAndSelect('category.user', 'user')
      .leftJoinAndSelect('plan.destinations', 'planDestinations')
      .leftJoinAndSelect('planDestinations.destination', 'destination')
      .addSelect(['user.id'])
      .where('category.categoryId = :categoryId', { categoryId })
      .andWhere('category.isDeleted = false')
      .getOne();

    if (travelCategory) {
      // travelCategory의 createdTimeSince 필드를 변환
      const transformedTravelCategory = {
        ...travelCategory,
        createdTimeSince: timeSince(travelCategory.createdAt),
      };

      return transformedTravelCategory;
    }

    return null;
  }

  /**
   * 특정 사용자의 모든 여행 카테고리를 조회하는 리포지토리 로직
   * @param userId 사용자 ID
   * @returns 특정 사용자의 여행 카테고리 엔티티 배열을 반환
   */
  async findUserTravelCategoriesByUserId(
    userId: number,
  ): Promise<CategoryEntity[]> {
    const travelCategories = await this.repository
      .createQueryBuilder('travelcategory')
      .where('travelcategory.user.id = :userId', { userId })
      .andWhere('travelcategory.isDeleted = false')
      .orderBy('travelcategory.createdAt', 'DESC')
      .select(['travelcategory.categoryId', 'travelcategory.categoryTitle'])
      .getMany();

    // 각 카테고리의 createdTimeSince 필드를 변환하여 반환
    return travelCategories.map((category) => ({
      ...category,
      createdTimeSince: timeSince(category.createdAt),
    }));
  }

  /**
   * 특정 여행 카테고리를 업데이트하는 리포지토리 로직
   * @param categoryId - 카테고리 ID
   * @param updateTravelCategoryDto - 업데이트할 정보 DTO
   * @returns void
   */
  async updateCategory(
    categoryId: number,
    // 업데이트 dto에서 여행지 태그는 제외하고 나머지만 업데이트 예정
    updateTravelCategoryDto: UpdateCategoryDto,
  ): Promise<void> {
    await this.repository.update(categoryId, {
      ...updateTravelCategoryDto,
      isUpdated: true,
      updatedAt: new Date(),
    });
  }

  /**
   * 특정 여행 컨테이너를 소프트 삭제하는 리포지토리 로직
   * @param containerId 여행 컨테이너 ID
   * @returns void
   */
  async softDeletedCategory(categoryId: number): Promise<void> {
    await this.repository.update(categoryId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }
}
