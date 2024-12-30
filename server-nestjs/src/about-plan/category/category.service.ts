import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
  ) {}

  /**
   * 새로운 여행 카테고리를 생성하는 메서드
   * @param createTravelCategoryDto - 생성할 카테고리 정보 DTO
   * @param userId - 생성하는 사용자의 ID
   * @returns 생성된 여행 카테고리 엔티티
   * @throws HttpException - 카테고리 제목이 50자를 초과하거나 중복될 경우
   */
  async createCategory(createCategoryDto: CreateCategoryDto, userId: number) {
    const user = await this.userService.findUserById(userId);

    if (createCategoryDto.categoryTitle.length > 20) {
      throw new BadRequestException(`카테고리 제목은 20자 내여야 합니다.`);
    }

    // 중복 확인(본인 카테고리 내에서)
    await this.checkDuplicateTitleWhenCreate(
      userId,
      createCategoryDto.categoryTitle,
    );

    // 카테고리 생성
    const category = await this.categoryRepository.createCategory(
      user,
      createCategoryDto,
    );

    // 생성된 카테고리 반환
    return await this.findCategoryById(category.categoryId);
  }

  async findCategoryById(categoryId: number) {
    const category = await this.categoryRepository.findCategoryById(categoryId);

    if (!category) {
      throw new NotFoundException(
        `${categoryId}에 해당하는 카테고리를 찾을 수 없습니다.`,
      );
    }

    return category;
  }

  /**
   * 특정 사용자의 모든 여행 카테고리를 조회하는 메서드
   * @param userId - 사용자 ID
   * @returns 조회된 카테고리 엔티티 배열
   * @throws HttpException - 카테고리를 찾을 수 없는 경우
   */
  async findUserTravelCategoriesByUserId(userId: number) {
    const categories =
      await this.categoryRepository.findUserTravelCategoriesByUserId(userId);

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
   * @param categoryId - 업데이트할 카테고리 ID
   * @param updateTravelCategoryDto - 업데이트할 정보 DTO
   * @returns 업데이트된 카테고리 엔티티
   * @throws HttpException - 카테고리를 찾을 수 없거나 업데이트할 수 없는 경우
   */
  async updateTravelCategory(
    categoryId: number,
    updateTravelCategoryDto: UpdateCategoryDto,
  ) {
    const category = await this.findCategoryById(categoryId);

    // 업데이트 요소가 있는지 확인. 없으면 메서드 중단
    const hasChanges = this.hasChanges(category, updateTravelCategoryDto);
    if (!hasChanges) {
      return category;
    }

    // 카테고리 title 제약조건
    if (updateTravelCategoryDto.categoryTitle.length > 50) {
      throw new BadRequestException(`카테고리 제목은 50자 내여야 합니다.`);
    }

    // 제약조건에 걸리지 않으면 기존 자신의 title과 변한게 있는지 확인 후
    // 사용자 카테고리 내에서 중복된 title이 있는지 확인
    if (updateTravelCategoryDto.categoryTitle !== category.categoryTitle) {
      await this.checkDuplicateTitleWhenUpdate(
        category.user.id,
        categoryId,
        updateTravelCategoryDto.categoryTitle,
      );
    }

    // TravelCategory 업데이트
    await this.categoryRepository.updateTravelCategory(
      categoryId,
      updateTravelCategoryDto, // destinations를 제외한 데이터로 업데이트
    );

    return await this.findCategoryById(categoryId);
  }

  /**
   * 업데이트 DTO와 기존 카테고리의 변경 여부를 확인하는 메서드
   * @param category - 기존 카테고리 엔티티
   * @param updateDto - 업데이트 DTO
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
   * @param userId - 사용자 ID
   * @param categoryTitle - 생성하려는 카테고리 제목
   * @throws HttpException - 중복된 제목이 있는 경우
   */
  private async checkDuplicateTitleWhenCreate(
    userId: number,
    categoryTitle: string,
  ): Promise<void> {
    const existingCategories =
      await this.categoryRepository.findUserTravelCategoriesByUserId(userId);

    // 하나라도 중복 요소가 있으면 예외처리
    if (
      existingCategories.some(
        (category) => category.categoryTitle === categoryTitle,
      )
    ) {
      throw new ConflictException(
        '동일한 제목의 travel category가 이미 존재합니다.',
      );
    }
  }

  /**
   * 카테고리 업데이트 시 제목 중복 여부를 확인하는 메서드
   * @param userId - 사용자 ID
   * @param categoryId - 업데이트 대상 카테고리 ID
   * @param categoryTitle - 업데이트하려는 카테고리 제목
   * @throws HttpException - 중복된 제목이 있는 경우
   */
  private async checkDuplicateTitleWhenUpdate(
    userId: number,
    categoryId: number,
    categoryTitle: string,
  ): Promise<void> {
    const existingCategories =
      await this.categoryRepository.findUserTravelCategoriesByUserId(userId);

    const isDuplicate = existingCategories.some(
      (category) =>
        category.categoryTitle === categoryTitle &&
        category.categoryId !== categoryId,
    );

    if (isDuplicate) {
      throw new ConflictException(
        '동일한 제목의 travel container가 이미 존재합니다.',
      );
    }
  }

  /**
   * 특정 여행 카테고리를 소프트 삭제하는 메서드
   * @param categoryId - 소프트 삭제할 카테고리 ID
   * @returns 삭제 성공 메시지
   * @throws HttpException - 카테고리를 찾을 수 없는 경우
   */
  async softDeletedTravelCategory(categoryId: number): Promise<any> {
    const category = await this.findCategoryById(categoryId);
    if (category) {
      await this.categoryRepository.softDeletedTravelCategory(categoryId);
      return { message: '성공적으로 삭제되었습니다.' };
    } else {
      throw new InternalServerErrorException(
        `${categoryId}에 해당하는 travel container를 삭제할 수 없습니다.`,
      );
    }
  }
}
