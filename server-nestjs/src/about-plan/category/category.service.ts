import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AvatarService } from 'src/about-user/avatar/avatar.service';
import { UpdateResult } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dtos/category.create.dto';
import { UpdateCategoryDto } from './dtos/category.update.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly avatarService: AvatarService,
  ) {}

  // ============================================================
  // =========================== MAIN ===========================
  // ============================================================

  /**
   * 카테고리 생성 메서드
   * @param createCategoryDto
   * @param avatarId
   * @returns
   */
  async createCategory(createCategoryDto: CreateCategoryDto, avatarId: number) {
    const avatar = await this.avatarService.findAvatarById(avatarId);

    if (createCategoryDto.categoryTitle.length > 20) {
      throw new BadRequestException(`카테고리 제목은 20자 내여야 합니다.`);
    }

    // 중복 확인(본인 아바타 내에서)
    await this.checkDuplicateTitleWhenCreate(
      avatar.avatarId,
      createCategoryDto.categoryTitle,
    );

    const category = await this.categoryRepository.createCategory(
      avatar,
      createCategoryDto,
    );

    return await this.findCategoryWithAvatarByCategoryId(category.categoryId);
  }

  /**
   * 카테고리와 카테고리 오너의 정보를 같이 조회하는 메서드
   * @param categoryId
   * @returns
   */
  async findCategoryWithAvatarByCategoryId(
    categoryId: number,
  ): Promise<CategoryEntity> {
    const category =
      await this.categoryRepository.findCategoryWithAvatarByCategoryId(
        categoryId,
      );

    if (!category) {
      throw new NotFoundException(
        `${categoryId}에 해당하는 카테고리를 찾을 수 없습니다.`,
      );
    }

    return category;
  }

  /**
   * 카테고리에 포함된 plan도 같이 조회하는 메서드
   * @param isOwner
   * @param categoryId
   * @returns
   */
  async findCategoryWithPlansByCategoryId(
    isOwner: boolean,
    categoryId: number,
  ): Promise<CategoryEntity> {
    const category =
      await this.categoryRepository.findCategoryWithPlansByCategoryId(
        categoryId,
      );

    if (!category) {
      throw new NotFoundException(
        `${categoryId}에 해당하는 카테고리를 찾을 수 없습니다.`,
      );
    }

    // 본인 카테고리 아니면 public만 보여줌
    return this.filterCategoryWithPublicPlans(isOwner, category);
  }

  /**
   * 카테고리를 업데이트하는 메서드
   */
  async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category =
      await this.categoryRepository.findCategoryWithAvatarByCategoryId(
        categoryId,
      );

    // 업데이트 요소가 있는지 확인. 없으면 메서드 중단
    const hasChanges = this.hasChanges(category, updateCategoryDto);
    if (!hasChanges) {
      return category;
    }

    // 카테고리 title 제약조건
    if (updateCategoryDto.categoryTitle.length > 20) {
      throw new BadRequestException(`카테고리 제목은 20자 내여야 합니다.`);
    }

    // 한 사용자 내에서 CategoryTitle 중복 확인
    if (updateCategoryDto.categoryTitle !== category.categoryTitle) {
      await this.checkDuplicateTitleWhenUpdate(
        category.avatar.avatarId,
        categoryId,
        updateCategoryDto.categoryTitle,
      );
    }

    await this.categoryRepository.updateCategory(categoryId, updateCategoryDto);

    return await this.findCategoryWithAvatarByCategoryId(categoryId);
  }

  /**
   * 특정 여행 카테고리를 소프트 삭제하는 메서드
   */
  async softDeletedCategory(categoryId: number): Promise<UpdateResult> {
    const category = await this.findCategoryWithAvatarByCategoryId(categoryId);
    return await this.categoryRepository.softDeletedCategory(
      category.categoryId,
    );
  }

  async softDeleteCategoriesByAvatar(avatarId: number): Promise<UpdateResult> {
    const avatar = await this.avatarService.findAvatarById(avatarId);
    return await this.categoryRepository.softDeleteCategoriesByAvatar(
      avatar.avatarId,
    );
  }

  // ============================================================
  // =========================== SUB ============================
  // ============================================================

  /**
   * 카테고리 오너가 맞는지 확인하는 메서드
   * @param categoryId
   * @param avatarId
   * @returns
   */
  async isCategoryOwner(
    categoryId: number,
    avatarId: number,
  ): Promise<boolean> {
    const category = await this.findCategoryWithAvatarByCategoryId(categoryId);
    return category.avatar.avatarId === avatarId;
  }

  /**
   * isOwner가 false면 PUBLIC인 plan만 남기는 메서드
   * @param isOwner
   * @param category
   * @returns
   */
  private filterCategoryWithPublicPlans(
    isOwner: boolean,
    category: CategoryEntity,
  ): CategoryEntity {
    // isOwner가 false면 PUBLIC인 plan만 남김
    if (!isOwner) {
      category.plans = category.plans.filter(
        (plan) => plan.status === 'PUBLIC',
      );
    }

    return category;
  }

  /**
   * 본인 아바타의 여행 카테고리를 모두 조회하는 메서드
   * @param avatar
   * @returns
   */
  async findCategoriesOfAvatarByAvatarId(avatar: number) {
    const categories =
      await this.categoryRepository.findCategoriesOfAvatarByAvatarId(avatar);

    // 카테고리가 없으면 예외를 발생시킴
    if (!categories || categories.length === 0) {
      throw new NotFoundException(
        `${avatar}의 travel category를 찾을 수 없습니다.`,
      );
    }

    return categories;
  }

  /**
   * 업데이트 DTO와 기존 카테고리의 변경 여부를 확인하는 메서드
   * @returns 변경 사항이 있으면 true, 없으면 false
   */
  private hasChanges(
    category: CategoryEntity,
    updateDto: UpdateCategoryDto,
  ): boolean {
    return (
      updateDto.categoryTitle &&
      category.categoryTitle !== updateDto.categoryTitle
    );
  }

  /**
   * 카테고리 생성 시에 본인 계정 내에서 중복된 카테고리가 있는지 확인
   * @param avatarId
   * @param categoryTitle
   */
  private async checkDuplicateTitleWhenCreate(
    avatarId: number,
    categoryTitle: string,
  ): Promise<void> {
    const existingCategories =
      await this.categoryRepository.findCategoriesOfAvatarByAvatarId(avatarId);

    // 하나라도 중복 요소가 있으면 예외처리
    if (
      existingCategories.some(
        (category) => category.categoryTitle === categoryTitle,
      )
    ) {
      throw new ConflictException('동일한 제목의 카테고리가 이미 존재합니다.');
    }
  }

  /**
   * 카테고리 업데이트 시에 본인 계정 내에서 중복된 카테고리가 있는지 확인
   * @param userId
   * @param categoryId
   * @param categoryTitle
   */
  private async checkDuplicateTitleWhenUpdate(
    userId: number,
    categoryId: number,
    categoryTitle: string,
  ): Promise<void> {
    const existingCategories =
      await this.categoryRepository.findCategoriesOfAvatarByAvatarId(userId);

    const isDuplicate = existingCategories.some(
      (category) =>
        category.categoryTitle === categoryTitle &&
        category.categoryId !== categoryId,
    );

    if (isDuplicate) {
      throw new ConflictException('동일한 제목의 카테고리가 이미 존재합니다.');
    }
  }
}
