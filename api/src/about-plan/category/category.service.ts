import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AvatarService } from 'src/about-user/avatar/avatar.service';
import { validateCategoryTitle } from 'src/utils/validateUserInput';
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
  async createCategory(
    createCategoryDto: CreateCategoryDto,
    avatarId: number,
  ): Promise<CategoryEntity> {
    const avatar = await this.avatarService.findAvatarById(avatarId);

    // 1. 유효성 검증
    validateCategoryTitle(createCategoryDto.categoryTitle);

    // 2. 중복 확인(본인 아바타 내에서)
    await this.checkDuplicateTitleWhenCreate(
      avatar.avatarId,
      createCategoryDto.categoryTitle,
    );

    return await this.categoryRepository.createCategory(
      avatar,
      createCategoryDto,
    );
  }

  /**
   * 카테고리와 카테고리 오너의 정보를 같이 조회하는 메서드
   * @param categoryId
   * @returns
   */
  async findCategoryById(categoryId: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException(
        `${categoryId}에 해당하는 카테고리를 찾을 수 없습니다.`,
      );
    }

    return category;
  }

  async findCategoryWithAvatar(categoryId: number): Promise<CategoryEntity> {
    const category =
      await this.categoryRepository.findCategoryWithAvatar(categoryId);

    if (!category) {
      throw new NotFoundException(
        `${categoryId}에 해당하는 카테고리를 찾을 수 없습니다.`,
      );
    }

    return category;
  }

  /**
   * 카테고리를 업데이트하는 메서드
   */
  async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<UpdateResult> {
    const category =
      await this.categoryRepository.findCategoryWithAvatar(categoryId);

    // 1. categoryTitle이 바꼈을 때, 한 사용자 내에서 CategoryTitle 중복 확인
    if (updateCategoryDto.categoryTitle !== category.categoryTitle) {
      await this.checkDuplicateTitleWhenUpdate(
        category.avatar.avatarId,
        categoryId,
        updateCategoryDto.categoryTitle,
      );
    }

    // 2. 유효성 검증
    validateCategoryTitle(updateCategoryDto.categoryTitle);

    return await this.categoryRepository.updateCategory(
      categoryId,
      updateCategoryDto,
    );
  }

  /**
   * 특정 카테고리를 삭제함
   * @param categoryId
   * @returns
   */
  async softDeletedCategory(categoryId: number): Promise<UpdateResult> {
    const category = await this.findCategoryById(categoryId);
    return await this.categoryRepository.softDeletedCategory(
      category.categoryId,
    );
  }

  /**
   * 특정 사용자의 모든 카테고리를 삭제함
   * @param categoryId
   * @returns
   */
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
  async isOwner(categoryId: number, avatarId: number): Promise<boolean> {
    const category = await this.findCategoryWithAvatar(categoryId);
    return category.avatar.avatarId === avatarId;
  }

  /**
   * 본인 아바타의 여행 카테고리를 모두 조회하는 메서드
   * @param avatar
   * @returns
   */
  async findCategoriesByAvatarId(avatarId: number): Promise<CategoryEntity[]> {
    const categories =
      await this.categoryRepository.findCategoriesByAvatarId(avatarId);

    // 카테고리가 없으면 예외를 발생시킴
    if (!categories || categories.length === 0) {
      throw new NotFoundException(`${avatarId}의 category를 찾을 수 없습니다.`);
    }

    return categories;
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
    const existingCategories = (
      await this.avatarService.findAvatarWithCategories(avatarId)
    ).categories;

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
    avatarId: number,
    categoryId: number,
    categoryTitle: string,
  ): Promise<void> {
    const existingCategories = await this.findCategoriesByAvatarId(avatarId);

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
