import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AvatarService } from 'src/about-user/avatar/avatar.service';
import { UserService } from 'src/about-user/user/user.service';
import { CategoryEntity } from './category.entity';
import { CategoryRepository } from './category.repository';
import { CreateCategoryDto } from './dtos/category.create.dto';
import { UpdateCategoryDto } from './dtos/category.update.dto';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly userService: UserService,
    private readonly avatarService: AvatarService,
  ) {}

  /**
   * 카테고리를 생성하는 메서드
   */
  async createCategory(createCategoryDto: CreateCategoryDto, userId: number) {
    const user = await this.userService.findUserWithAvatarByUserId(userId);

    // 카테고리는 아바타와 연결되어야 함
    const avatar = await this.avatarService.findAvatarById(
      user.avatar.avatarId,
    );

    if (createCategoryDto.categoryTitle.length > 20) {
      throw new BadRequestException(`카테고리 제목은 20자 내여야 합니다.`);
    }

    // 중복 확인(본인 카테고리 내에서)
    await this.checkDuplicateTitleWhenCreate(
      avatar.avatarId,
      createCategoryDto.categoryTitle,
    );

    const category = await this.categoryRepository.createCategory(
      avatar,
      createCategoryDto,
    );

    return await this.findCategoryById(category.categoryId);
  }

  async findCategoryById(categoryId: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException(
        `${categoryId}에 해당하는 카테고리를 찾을 수 없습니다.`,
      );
    }

    return category;
  }

  async findCategoryWithPlansByCategoryId(
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

    return category;
  }

  /**
   * 특정 사용자의 모든 여행 카테고리를 조회하는 메서드
   * 특정 사용자 내에서 CategoryTitle 중복 확인용으로 사용됨.
   */
  async findCategoriesOfAvatarByAvatarId(userId: number) {
    const categories =
      await this.categoryRepository.findCategoriesOfAvatarByAvatarId(userId);

    // 카테고리가 없으면 예외를 발생시킴
    if (!categories || categories.length === 0) {
      throw new NotFoundException(
        `${userId}의 travel category를 찾을 수 없습니다.`,
      );
    }

    return categories;
  }

  /**
   * 카테고리를 업데이트하는 메서드
   */
  async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.categoryRepository.findCategoryById(categoryId);

    // 업데이트 요소가 있는지 확인. 없으면 메서드 중단
    const hasChanges = this.hasChanges(category, updateCategoryDto);
    if (!hasChanges) {
      return category;
    }

    // 카테고리 title 제약조건
    if (updateCategoryDto.categoryTitle.length > 50) {
      throw new BadRequestException(`카테고리 제목은 50자 내여야 합니다.`);
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

    return await this.findCategoryById(categoryId);
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
   * 새로운 카테고리 생성 시 제목 중복 여부를 확인하는 메서드
   */
  private async checkDuplicateTitleWhenCreate(
    userId: number,
    categoryTitle: string,
  ): Promise<void> {
    const existingCategories =
      await this.categoryRepository.findCategoriesOfAvatarByAvatarId(userId);

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
   * 카테고리 업데이트 시 제목 중복 여부를 확인하는 메서드
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

  /**
   * 특정 여행 카테고리를 소프트 삭제하는 메서드
   */
  async softDeletedCategory(categoryId: number): Promise<any> {
    const category = await this.findCategoryById(categoryId);
    if (category) {
      await this.categoryRepository.softDeletedCategory(categoryId);
      return { message: '성공적으로 삭제되었습니다.' };
    } else {
      throw new InternalServerErrorException(
        `${categoryId}에 해당하는 travel container를 삭제할 수 없습니다.`,
      );
    }
  }
}
