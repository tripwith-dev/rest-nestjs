import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { AvatarLikePlanService } from 'src/avatar-like-plan/avatar-like-plan.service';
import { Currency } from 'src/common/enum/currency';
import { Status } from 'src/common/enum/status';
import { validateDates, validatePlanTitle } from 'src/utils/validateUserInput';
import { CategoryService } from '../category/category.service';
import { PlanTagMappingService } from '../plan-tag-mapping/plan-tag-mapping.service';
import { PlanTagService } from '../plan-tag/plan-tag.service';
import { UpdatePlanWithDestinationDto } from './dto/plan-destination.update.dto';
import { CreatePlanDto } from './dto/plan.create.dto';
import { PlanEntity } from './plan.entity';
import { PlanRepository } from './plan.repository';

@Injectable()
export class PlanService {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly categoryService: CategoryService,
    private readonly planTagService: PlanTagService,
    private readonly planTagMappingService: PlanTagMappingService,
    private readonly avatarLikePlanService: AvatarLikePlanService,
  ) {}

  // ============================================================
  // =========================== MAIN ===========================
  // ============================================================

  /**
   * 여행 계획 생성
   *
   * @param categoryId - 여행 계획이 속할 카테고리 ID
   * @param createTravelPlanDto - 생성할 여행 계획 정보 (제목, 일정, 여행지 등 포함)
   * @returns {Promise<PlanEntity>} - 생성된 여행 계획 엔티티
   * @throws {BadRequestException} - 제목 길이가 30자를 초과한 경우 또는 동일 카테고리 내 제목이 중복된 경우
   * @throws {Error} - 날짜 유효성 검사 실패 또는 여행지 생성/조회 실패 시 발생할 수 있음
   */
  async createPlan(
    avatar: AvatarEntity,
    categoryId: number,
    createTravelPlanDto: CreatePlanDto,
  ): Promise<PlanEntity> {
    const category = await this.categoryService.findCategoryById(categoryId);

    // 1. title 검증
    validatePlanTitle(createTravelPlanDto.planTitle);

    // 2. 특정 카테고리 내에 planTitle 중복 확인
    await this.checkDuplicateTitle(categoryId, createTravelPlanDto.planTitle);

    // 3. 계획 일정 검증
    validateDates(
      createTravelPlanDto.travelStartDate,
      createTravelPlanDto.travelEndDate,
    );

    // 4. plan 생성
    const plan = await this.planRepository.createPlan(
      avatar,
      category,
      createTravelPlanDto,
    );

    // 5. 여행지 처리
    await this.processDestinations(createTravelPlanDto, plan);

    return await this.findPlanById(plan.planId);
  }

  /**
   *
   * @param planId
   * @param isOwner
   * @returns
   */
  async findPlansByCategoryId(
    categoryId: number,
  ): Promise<PlanEntity[] | undefined> {
    const plans = await this.planRepository.findPlansByCategoryId(categoryId);
    if (!plans) {
      throw new NotFoundException(
        `${categoryId}의 여행 계획 목록을 찾을 수 없습니다.`,
      );
    }

    return plans;
  }

  /**
   * 특정 여행 계획에 속한 여행 디테일들의 제목을 조회하는 서비스 로직
   * @param planId 여행 계획 ID
   * @returns 여행 디테일 제목 리스트를 반환
   */
  async findPlanWithDetail(planId: number) {
    const plan = await this.planRepository.findPlanWithDetail(planId);

    if (!plan) {
      throw new NotFoundException(
        `${planId}에 해당하는 여행 계획 목록을 찾을 수 없습니다.`,
      );
    }

    return plan;
  }

  /**
   * 좋아요 Top 10 여행 계획 조회
   * 동점일 경우 최신 순으로 정렬
   * 메인페이지 배너에서 사용됨.
   * @param currency - 반환할 금액의 통화 단위 (기본값: KRW)
   * @returns {Promise<PlanEntity[]>} - 좋아요 순위 상위 10개의 여행 계획 목록
   * @throws {Error} - 여행 계획 데이터를 조회하거나 처리 중 오류가 발생할 경우
   */
  async findPopularPlans(): Promise<PlanEntity[]> {
    const plans = await this.planRepository.findPopularPlans();

    if (!plans) {
      throw new NotFoundException('플랜을 찾을 수 없습니다.');
    }

    return plans;
  }

  /**
   * 특정 여행 계획을 업데이트
   * @param planId - 업데이트할 여행 계획의 ID
   * @param updatePlanWithDestinationDto - 업데이트할 여행 계획의 데이터 (계획 제목, 일정, 목적지 등)
   * @returns {Promise<PlanEntity>} - 업데이트된 여행 계획 엔티티
   * @throws {BadRequestException} - 제목이 30자를 초과하거나 중복된 경우
   * @throws {NotFoundException} - 여행 계획이 존재하지 않을 경우
   * @throws {InternalServerErrorException} - 계획을 업데이트하는 중에 문제가 발생한 경우
   */
  async updatePlan(
    planId: number,
    updatePlanWithDestinationDto: UpdatePlanWithDestinationDto,
  ): Promise<PlanEntity> {
    const plan = await this.findPlanAllInfo(planId);

    // 1. planTitle 예외처리
    validatePlanTitle(updatePlanWithDestinationDto.planTitle);

    // 2. planTitle이 변경된 경우에 중복 확인(동일 category 내에서만 중복 확인)
    await this.checkDuplicateTitleWhenUpdate(
      plan.category.categoryId,
      planId,
      updatePlanWithDestinationDto.planTitle,
    );

    // 3. 여행 날짜 변경 시에 날짜가 올바른지 확인
    validateDates(
      updatePlanWithDestinationDto.travelStartDate,
      updatePlanWithDestinationDto.travelEndDate,
    );

    // 4. 위 조건이 문제 없으면 여행지를 제외한 데이터들만 변경
    const { tagMappings, ...planData } = updatePlanWithDestinationDto;
    await this.planRepository.updatePlan(planId, planData);

    // 5. tagMappings 업데이트 (pTagName만 보내기 위해 map 함수 사용)
    const pTagNames =
      tagMappings?.map((tagMapping) => tagMapping.planTag.pTagName) || [];
    await this.planTagMappingService.updatePlanTags(plan, pTagNames);

    //plan 기한 내에 있는 detail의 총금액만 계산
    if (
      updatePlanWithDestinationDto.travelStartDate ||
      updatePlanWithDestinationDto.travelEndDate
    ) {
      await this.updateTotalPrice(planId);
    }

    return await this.findPlanById(planId);
  }

  /**
   * 특정 여행 계획을 소프트 삭제
   * @param planId - 소프트 삭제할 여행 계획의 고유 ID
   * @returns {Promise<{ message: string; plan: PlanEntity }>} - 삭제 성공 메시지와 삭제된 계획 데이터
   * @throws {InternalServerErrorException} - 해당 ID의 여행 계획이 존재하지 않을 경우 발생
   */
  async softDeletedPlan(
    planId: number,
  ): Promise<{ message: string; plan: PlanEntity }> {
    const plan = await this.findPlanById(planId);
    if (plan) {
      await this.planRepository.softDeletedPlan(planId);
      return { message: '성공적으로 삭제되었습니다.', plan };
    } else {
      throw new InternalServerErrorException(
        `${planId}에 해당하는 여행 계획을 삭제할 수 없습니다.`,
      );
    }
  }

  /**
   * 카테고리의 메인 이미지를 추가하는 메서드
   * @param categoryId - 카테고리 ID
   * @param mainImageUrl - 추가할 메인 이미지 URL
   * @returns 업데이트된 카테고리 엔티티
   */
  async replaceMainImage(
    planId: number,
    mainImageUrl: string,
  ): Promise<PlanEntity> {
    const plan = await this.findPlanById(planId);
    await this.planRepository.replaceMainImage(plan.planId, mainImageUrl);
    return await this.findPlanById(planId);
  }
  /**
   * 카테고리의 메인 이미지를 삭제하는 메서드
   * @param categoryId - 카테고리 ID
   * @returns 업데이트된 카테고리 엔티티
   * @throws HttpException - 카테고리를 찾을 수 없는 경우
   */
  async deleteMainImage(planId: number): Promise<PlanEntity> {
    const plan = await this.findPlanById(planId);
    await this.planRepository.deleteMainImage(plan.planId);
    return await this.findPlanById(planId);
  }

  /**
   * 여행 계획에 좋아요 추가
   * @param planId 여행 계획 ID
   * @param userId 사용자 ID
   */
  async addLike(
    planId: number,
    avatarId: number,
  ): Promise<{ message: string; plan: PlanEntity }> {
    const alreadyLiked = await this.avatarLikePlanService.hasUserLikedPlan(
      planId,
      avatarId,
    );

    if (alreadyLiked) {
      throw new ConflictException('이미 좋아요를 누른 여행 계획입니다.');
    }

    await this.avatarLikePlanService.addLike(planId, avatarId);
    const plan = await this.findPlanById(planId);

    if (!plan) {
      throw new NotFoundException('여행 계획을 찾을 수 없습니다.');
    }

    return { message: '좋아요가 추가되었습니다.', plan };
  }

  /**
   * 여행 계획에서 좋아요 제거
   * @param planId 여행 계획 ID
   * @param userId 사용자 ID
   */
  async deleteLike(
    planId: number,
    avatarId: number,
  ): Promise<{ message: string; plan: PlanEntity }> {
    const alreadyLiked = await this.avatarLikePlanService.hasUserLikedPlan(
      planId,
      avatarId,
    );

    if (!alreadyLiked) {
      throw new BadRequestException('좋아요를 누르지 않은 여행 계획입니다.');
    }

    await this.avatarLikePlanService.deleteLike(planId, avatarId);
    const plan = await this.findPlanById(planId);

    if (!plan) {
      throw new NotFoundException('여행 계획을 찾을 수 없습니다.');
    }

    return { message: '좋아요가 추가되었습니다.', plan };
  }

  // ============================================================
  // =========================== SUB ============================
  // ============================================================

  /**
   * 여행 계획 조회
   * @param planId - 조회할 여행 계획의 ID
   * @param currency - 반환할 금액의 통화 단위 (기본값: KRW)
   * @returns {Promise<PlanEntity | undefined>} - 조회된 여행 계획 엔티티 또는 undefined
   * @throws {NotFoundException} - 주어진 planId에 해당하는 여행 계획이 없을 경우
   */
  async findPlanById(planId: number): Promise<PlanEntity | undefined> {
    const plan = await this.planRepository.findPlanById(planId);

    if (!plan) {
      throw new NotFoundException(
        `${planId}에 해당하는 여행 계획 목록을 찾을 수 없습니다.`,
      );
    }

    return plan;
  }

  /**
   *
   * @param planId
   * @param isOwner
   * @returns
   */
  async findPlanAllInfo(planId: number): Promise<PlanEntity | undefined> {
    const plan = await this.planRepository.findPlanAllInfo(planId);

    if (!plan) {
      throw new NotFoundException(
        `${planId}에 해당하는 여행 계획 목록을 찾을 수 없습니다.`,
      );
    }

    return plan;
  }

  async findPlanWithAvatar(planId: number): Promise<PlanEntity | undefined> {
    const plan = await this.planRepository.findPlanWithAvatar(planId);
    if (!plan) {
      throw new NotFoundException(
        `${planId}에 해당하는 여행 계획 목록을 찾을 수 없습니다.`,
      );
    }

    return plan;
  }

  /**
   * PRIVATE이든 PUBLIC이든 본인만 접근 가능
   * @param planId
   * @param avatarId
   * @returns
   */
  async isPlanOwner(planId: number, avatarId: number): Promise<boolean> {
    const plan = await this.findPlanWithAvatar(planId);
    return plan.avatar.avatarId === avatarId;
  }

  /**
   * PRIVATE이라면 본인만 접근 가능
   * @param planId
   * @param avatarId
   * @returns
   */
  async isPlanAccessible(planId: number, avatarId: number): Promise<boolean> {
    const plan = await this.findPlanWithAvatar(planId);
    return plan.avatar.avatarId === avatarId || plan.status !== Status.PRIVATE;
  }

  /**
   * 여행지가 존재하면 존재하는 지역에 연결, 존재하지 않으면 새로 생성 후 연결
   * @param createTravelPlanDto
   * @param plan
   */
  async processDestinations(
    createTravelPlanDto: CreatePlanDto,
    plan: PlanEntity,
  ) {
    if (
      createTravelPlanDto.tagMappings &&
      createTravelPlanDto.tagMappings.length > 0
    ) {
      for (const tagMapping of createTravelPlanDto.tagMappings) {
        const tagName = tagMapping.planTag.pTagName;

        // 1. Destination이 이미 존재하는지 확인
        let tagEntity =
          await this.planTagService.findOneByDestinationName(tagName);

        // 2. 존재하지 않는다면 새로 생성
        if (!tagEntity) {
          tagEntity = await this.planTagService.createDestination(tagName);
        }

        // 3. CategoryDestination 관계 생성
        await this.planTagMappingService.createPlanDestination(plan, tagEntity);
      }
    }
  }

  /**
   * plan을 생성 할 때, 동일 카테고리 내에 중복되는 plan title이 있는지 확인
   * @param categoryId - 확인할 카테고리의 ID
   * @param planTitle - 중복 여부를 확인할 여행 계획의 제목
   * @throws {ConflictException} - 동일한 제목의 여행 계획이 이미 존재할 경우 발생
   * @returns {Promise<void>} - 반환값 없음
   */
  private async checkDuplicateTitle(
    categoryId: number,
    planTitle: string,
  ): Promise<void> {
    const existingPlans =
      await this.planRepository.findPlansByCategoryId(categoryId);

    // 하나라도 중복 요소가 있으면 예외처리
    if (
      existingPlans &&
      existingPlans.some((plan) => plan.planTitle === planTitle)
    ) {
      throw new ConflictException('동일한 제목의 plan 이미 존재합니다.');
    }
  }

  /**
   * plan을 업데이트 할 때, 동일 카테고리 내에 중복되는 plan title이 있는지 확인
   * @param categoryId - 확인할 카테고리의 ID
   * @param planId - 현재 업데이트하려는 여행 계획의 ID
   * @param planTitle - 중복 여부를 확인할 여행 계획의 제목
   * @throws {ConflictException} - 동일한 제목의 여행 계획이 이미 존재할 경우 발생
   * @returns {Promise<void>} - 반환값 없음
   */
  private async checkDuplicateTitleWhenUpdate(
    categoryId: number,
    planId: number,
    planTitle: string,
  ): Promise<void> {
    const existingPlans =
      await this.planRepository.findPlansByCategoryId(categoryId);

    const isDuplicate = existingPlans.some(
      (plan) => plan.planTitle === planTitle && plan.planId !== Number(planId),
    );

    if (isDuplicate) {
      throw new ConflictException('동일한 제목의 plan 이미 존재합니다.');
    }
  }

  /**
   * 특정 여행 계획의 총 비용을 주어진 통화로 변환하여 계산하는 서비스 로직
   * @param planId 여행 계획 ID
   * @param targetCurrency 변환할 통화 (USD, JPY, KRW, EUR)
   * @returns 총 비용
   */
  async calculateTotalPrice(
    planId: number,
    targetCurrency: Currency,
  ): Promise<number> {
    const plan = await this.planRepository.findPlanWithDetail(planId);

    const exchangeRates = {
      USD: 1,
      KRW: 1450,
      EUR: 0.92,
      JPY: 145,
    };

    let total = 0;

    // details가 존재하지 않으면 빈 배열로 처리
    let details = [];

    if (plan) {
      details = plan.details;
    }

    if (plan && details.length > 0) {
      for (const detail of details) {
        const detailPrice = detail.price || 0;
        const detailCurrency = detail.currency || Currency.USD;

        const convertedPrice =
          detailPrice *
          (exchangeRates[targetCurrency] / exchangeRates[detailCurrency]);
        total += convertedPrice;
      }
    }

    // 소수점 2자리까지 반올림
    return parseFloat(total.toFixed(2));
  }

  /**
   * 특정 여행 계획의 총 비용을 갱신하는 로직
   * @param planId 여행 계획 ID
   * @returns void
   */
  async updateTotalPrice(planId: number): Promise<void> {
    try {
      const totalExpenses = await this.calculateTotalPrice(
        planId,
        Currency.KRW,
      );

      await this.planRepository.updateTotalExpenses(planId, totalExpenses);
      console.log(`전체 비용 업데이트 됨 ${planId}`);
    } catch (error) {
      console.error(`전체비용 업데이트 안됨 ${planId}:`, error);
      throw error;
    }
  }
}
