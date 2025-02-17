import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AvatarLikePlanRepository } from 'src/avatar-like-plan/avatar-like-plan.repository';
import { convertTotalExpenses } from 'src/utils/convertTotalExpenses';
import { CategoryService } from '../category/category.service';
import { DestinationService } from '../destination/destination.service';
import { PlanDestinationService } from '../plan-destination/plan-destination.service';
import { Currency } from '../plandetail/plandetail.entity';
import { UpdatePlanWithDestinationDto } from './dto/plan-destination.update.dto';
import { CreatePlanDto } from './dto/plan.create.dto';
import { PlanEntity } from './plan.entity';
import { PlanRepository } from './plan.repository';

@Injectable()
export class PlanService {
  constructor(
    private readonly planRepository: PlanRepository,
    private readonly categoryService: CategoryService,
    private readonly destinationService: DestinationService,
    private readonly planDestinationService: PlanDestinationService,
    private readonly avatarLikePlanRepository: AvatarLikePlanRepository,
  ) {}

  /**
   * 여행 계획 생성
   *
   * @param categoryId - 여행 계획이 속할 카테고리 ID
   * @param createTravelPlanDto - 생성할 여행 계획 정보 (제목, 일정, 여행지 등 포함)
   * @returns {Promise<PlanEntity>} - 생성된 여행 계획 엔티티
   * @throws {BadRequestException} - 제목 길이가 30자를 초과한 경우 또는 동일 카테고리 내 제목이 중복된 경우
   * @throws {Error} - 날짜 유효성 검사 실패 또는 여행지 생성/조회 실패 시 발생할 수 있음
   */
  async createTravelPlan(
    categoryId: number,
    createTravelPlanDto: CreatePlanDto,
  ): Promise<PlanEntity> {
    const category = await this.categoryService.findCategoryById(categoryId);

    // 1. 제목 제약 조건 확인
    if (
      createTravelPlanDto.planTitle &&
      createTravelPlanDto.planTitle.length > 30
    ) {
      throw new BadRequestException(`계획 제목은 30자 이내입니다.`);
    }

    // 2. 특정 카테고리 내에 planTitle 중복 확인
    await this.checkDuplicateTitle(categoryId, createTravelPlanDto.planTitle);

    // 3. 계획 일정 검증
    this.validateDates(
      createTravelPlanDto.travelStartDate,
      createTravelPlanDto.travelEndDate,
    );

    // 4. plan 생성
    const plan = await this.planRepository.createTravelPlan(
      category,
      createTravelPlanDto,
    );

    // 5. 여행지 데이터 처리
    if (
      createTravelPlanDto.destinations &&
      createTravelPlanDto.destinations.length > 0
    ) {
      for (const destination of createTravelPlanDto.destinations) {
        const destinationName = destination.destination.destinationName;

        // 5-1. Destination이 이미 존재하는지 확인
        let destinationEntity =
          await this.destinationService.findOneByDestinationName(
            destinationName,
          );

        // 5-2. 존재하지 않는다면 새로 생성
        if (!destinationEntity) {
          destinationEntity =
            await this.destinationService.createDestination(destinationName);
        }

        // 5-3. CategoryDestination 관계 생성
        await this.planDestinationService.createPlanDestination(
          plan,
          destinationEntity,
        );
      }
    }

    return await this.findPlanById(plan.planId);
  }

  /**
   * 여행 계획 조회
   * @param planId - 조회할 여행 계획의 ID
   * @param currency - 반환할 금액의 통화 단위 (기본값: KRW)
   * @returns {Promise<PlanEntity | undefined>} - 조회된 여행 계획 엔티티 또는 undefined
   * @throws {NotFoundException} - 주어진 planId에 해당하는 여행 계획이 없을 경우
   */
  async findPlanById(
    planId: number,
    currency: Currency = Currency.KRW,
  ): Promise<PlanEntity | undefined> {
    const plan = await this.planRepository.findPlanById(planId);

    if (!plan) {
      throw new NotFoundException(
        `${planId}에 해당하는 여행 계획 목록을 찾을 수 없습니다.`,
      );
    }

    // 통화 변환
    if (plan.totalExpenses) {
      plan.totalExpenses = convertTotalExpenses(
        plan.totalExpenses,
        Currency.KRW, // default는 KRW
        currency,
      );
    }

    return plan;
  }

  /**
   * 여행 계획과 카테고리까지 조회
   * @param planId - 조회할 여행 계획의 ID
   * @param currency - 반환할 금액의 통화 단위 (기본값: KRW)
   * @returns {Promise<PlanEntity | undefined>} - 조회된 여행 계획 엔티티 (카테고리 포함) 또는 undefined
   * @throws {NotFoundException} - 주어진 planId에 해당하는 여행 계획이 없을 경우
   */
  async findPlanWithCategoryByPlanId(
    planId: number,
    currency: Currency = Currency.KRW,
  ): Promise<PlanEntity | undefined> {
    const travelPlan =
      await this.planRepository.findPlanWithCategoryByPlanId(planId);

    if (!travelPlan) {
      throw new NotFoundException(
        `${planId}에 해당하는 여행 계획 목록을 찾을 수 없습니다.`,
      );
    }

    // 통화 변환
    if (travelPlan.totalExpenses) {
      travelPlan.totalExpenses = convertTotalExpenses(
        travelPlan.totalExpenses,
        Currency.KRW, // default는 KRW
        currency,
      );
    }

    return travelPlan;
  }

  /**
   * 좋아요 Top 10 여행 계획 조회
   * 동점일 경우 최신 순으로 정렬
   * 메인페이지 배너에서 사용됨.
   * @param currency - 반환할 금액의 통화 단위 (기본값: KRW)
   * @returns {Promise<PlanEntity[]>} - 좋아요 순위 상위 10개의 여행 계획 목록
   * @throws {Error} - 여행 계획 데이터를 조회하거나 처리 중 오류가 발생할 경우
   */
  async findTopTenTravelPlan(
    currency: Currency = Currency.KRW,
  ): Promise<PlanEntity[]> {
    const travelPlans = await this.planRepository.findTopTenTravelPlan();

    for (const plan of travelPlans) {
      if (plan && plan.totalExpenses) {
        plan.totalExpenses = convertTotalExpenses(
          plan.totalExpenses,
          Currency.KRW,
          currency,
        );
      }
    }

    return travelPlans;
  }

  /**
   * <테스트용>
   * 모든 plan 조회
   */
  async findAllTravelPlans(
    currency: Currency = Currency.KRW,
  ): Promise<PlanEntity[]> {
    const travelPlans = await this.planRepository.findAllTravelPlans();

    for (const plan of travelPlans) {
      if (plan && plan.totalExpenses) {
        plan.totalExpenses = convertTotalExpenses(
          plan.totalExpenses,
          Currency.KRW,
          currency,
        );
      }
    }

    return travelPlans;
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
    const plan = await this.findPlanWithCategoryByPlanId(planId);
    if (plan) {
      /** 변경 사항이 있는지 체크(변경 사항이 없으면 기존 plan 반환)
       * 변한게 없는 요소는 그대로 냅두고, 변한 요소만 덮어씌우기 때문에
       * 아래 로직을 안써도 되긴 함. */
      const hasChanges = this.hasChanges(plan, updatePlanWithDestinationDto);
      if (!hasChanges) {
        return plan;
      }

      // 1. planTitle 예외처리
      if (
        updatePlanWithDestinationDto.planTitle &&
        updatePlanWithDestinationDto.planTitle.length > 30
      ) {
        throw new BadRequestException(`계획 제목은 30자 이내입니다.`);
      }

      // 2. planTitle이 변경된 경우에 중복 확인(동일 category 내에서만 중복 확인)
      if (plan.planTitle !== updatePlanWithDestinationDto.planTitle) {
        await this.checkDuplicateTitleWhenUpdate(
          plan.category.categoryId,
          planId,
          updatePlanWithDestinationDto.planTitle,
        );
      }

      // 3. 여행 날짜 변경 시에 날짜가 올바른지 확인
      if (
        updatePlanWithDestinationDto.travelStartDate ||
        updatePlanWithDestinationDto.travelEndDate
      ) {
        // plan 시간대 확인
        this.validateDates(
          updatePlanWithDestinationDto.travelStartDate,
          updatePlanWithDestinationDto.travelEndDate,
        );
      }

      // 4. 위 조건이 문제 없으면 여행지를 제외한 데이터들만 변경
      const { destinations, ...planData } = updatePlanWithDestinationDto;
      await this.planRepository.updatePlan(planId, planData);

      // 5. destination 업데이트 (destinationName만 보내기 위해 map 함수 사용)
      const destinationNames =
        destinations?.map(
          (destination) => destination.destination.destinationName,
        ) || [];
      await this.updateDestinationTags(plan, destinationNames);

      /** plan 기간 변경 시에 plan 기간 내에 없는 detail은 전부
       * 삭제시켜야 하지만, 이곳에서 detail을 삭제를 한다면 순환참조 문제가
       * 발생하기에, totalExpenses 연산에서 제외시키는 정도로만 처리
       */
      if (
        updatePlanWithDestinationDto.travelStartDate ||
        updatePlanWithDestinationDto.travelEndDate
      ) {
        await this.updateTotalExpenses(planId);
      }

      return await this.findPlanById(planId);
    } else {
      throw new InternalServerErrorException(
        `${planId}에 해당하는 여행 계획을 업데이트 할 수 없습니다.`,
      );
    }
  }

  /**
   * 카테고리의 destination 태그를 업데이트
   * @param plan - 업데이트 대상이 되는 여행 계획 엔티티
   * @param newDestinations - 업데이트할 새로운 목적지 이름 배열
   * @returns {Promise<void>} - 처리 완료 후 반환값 없음
   * @throws {Error} - 목적지 추가 또는 삭제 처리 중 발생하는 문제
   */
  private async updateDestinationTags(
    plan: PlanEntity,
    newDestinations: string[],
  ) {
    // 기존 destination 가져오기
    const existingCategoryDestinations = plan.destinations;

    // destinationName만 비교하기 위해 매핑
    // 기존 destinationName과 새로운 destinationName 비교를 위해 Set 이용
    const existingNames = new Set(
      existingCategoryDestinations.map(
        (dest) => dest.destination.destinationName,
      ),
    );
    const newNames = new Set(newDestinations || []);

    // newDestinations가 null 또는 빈 배열인 경우 모든 요소 삭제
    if (!newDestinations || newDestinations.length === 0) {
      await this.planDestinationService.softDeletePlanDestinations(
        existingCategoryDestinations,
      );
    } else {
      // 생성할 요소 찾기: 새로운 데이터에는 있고, 기존 데이터에는 없는 것을 초이스
      const destinationsToAdd = [...newNames].filter(
        (name) => !existingNames.has(name),
      );

      // 삭제할 요소 찾기: 새로운 데이터에는 없고, 기존 데이터에는 있는 것을 초이스
      const destinationsToRemove = existingCategoryDestinations.filter(
        (categoryDest) =>
          !newNames.has(categoryDest.destination.destinationName),
      );

      // 삭제 요소 제거
      if (destinationsToRemove.length > 0) {
        await this.planDestinationService.softDeletePlanDestinations(
          destinationsToRemove,
        );
      }

      // 추가 요소 처리
      for (const destinationName of destinationsToAdd) {
        let destination =
          await this.destinationService.findOneByDestinationName(
            destinationName,
          );
        // 추가할 요소가 destination 테이블에 없다면 추가 후 관계 테이블 설정
        if (!destination) {
          destination =
            await this.destinationService.createDestination(destinationName);
        }
        await this.planDestinationService.createPlanDestination(
          plan,
          destination,
        );
      }
    }
  }

  /**
   * 특정 여행 계획을 소프트 삭제
   * @param planId - 소프트 삭제할 여행 계획의 고유 ID
   * @returns {Promise<{ message: string; plan: PlanEntity }>} - 삭제 성공 메시지와 삭제된 계획 데이터
   * @throws {InternalServerErrorException} - 해당 ID의 여행 계획이 존재하지 않을 경우 발생
   */
  async softDeletedTravelPlan(
    planId: number,
  ): Promise<{ message: string; plan: PlanEntity }> {
    const plan = await this.findPlanById(planId);
    if (plan) {
      await this.planRepository.softDeletedTravelPlan(planId);
      return { message: '성공적으로 삭제되었습니다.', plan };
    } else {
      throw new InternalServerErrorException(
        `${planId}에 해당하는 여행 계획을 삭제할 수 없습니다.`,
      );
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
      throw new ConflictException('동일한 제목의 여행 계획이 이미 존재합니다.');
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
      (plan) => plan.planTitle === planTitle && plan.planId !== planId,
    );

    if (isDuplicate) {
      throw new ConflictException(
        '동일한 제목의 travel container가 이미 존재합니다.',
      );
    }
  }

  /**
   * 여행 시작 날짜와 종료 날짜의 유효성을 검사하는 로직
   * @param startDate 여행 시작 날짜 (YYYYMMDD 형식)
   * @param endDate 여행 종료 날짜 (YYYYMMDD 형식)
   * @returns void
   */
  private validateDates(startDate?: string, endDate?: string): void {
    if (startDate && endDate) {
      // YYYYMMDD 형식을 YYYY-MM-DD 형식으로 변환
      const formattedStartDate = `${startDate.slice(0, 4)}-${startDate.slice(4, 6)}-${startDate.slice(6, 8)}`;
      const formattedEndDate = `${endDate.slice(0, 4)}-${endDate.slice(4, 6)}-${endDate.slice(6, 8)}`;

      const start = new Date(formattedStartDate);
      const end = new Date(formattedEndDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new BadRequestException('유효한 날짜 형식이 아닙니다.');
      }

      if (start > end) {
        throw new BadRequestException(
          '여행 시작 날짜는 종료 날짜보다 클 수 없습니다.',
        );
      }
    }
  }

  /**
   * 업데이트 DTO와 기존 컨테이너의 변경 여부를 확인하는 로직
   * @param container 기존 컨테이너 객체
   * @param updateDto 업데이트 DTO
   * @returns 변경 사항이 있는 경우 true, 없는 경우 false
   */
  private hasChanges(
    plan: PlanEntity,
    updatePlanWithDestinationDto: UpdatePlanWithDestinationDto,
  ): boolean {
    return (
      (updatePlanWithDestinationDto.planTitle &&
        plan.planTitle !== updatePlanWithDestinationDto.planTitle) ||
      (updatePlanWithDestinationDto.travelStartDate &&
        plan.travelStartDate !==
          updatePlanWithDestinationDto.travelStartDate) ||
      (updatePlanWithDestinationDto.travelEndDate &&
        plan.travelEndDate !== updatePlanWithDestinationDto.travelEndDate) ||
      (updatePlanWithDestinationDto.status &&
        plan.status !== updatePlanWithDestinationDto.status) ||
      (updatePlanWithDestinationDto.destinations &&
        plan.destinations !== updatePlanWithDestinationDto.destinations)
    );
  }

  /**
   * 특정 여행 계획에 속한 여행 디테일들의 제목을 조회하는 서비스 로직
   * @param planId 여행 계획 ID
   * @returns 여행 디테일 제목 리스트를 반환
   */
  async findPlanWithDetailByPlanId(planId: number) {
    const plan = await this.planRepository.findPlanWithDetailByPlanId(planId);

    if (!plan) {
      throw new NotFoundException(
        `${planId}에 해당하는 여행 계획 목록을 찾을 수 없습니다.`,
      );
    }

    return plan;
  }

  /**
   * 특정 여행 계획의 총 비용을 주어진 통화로 변환하여 계산하는 서비스 로직
   * @param planId 여행 계획 ID
   * @param targetCurrency 변환할 통화 (USD, JPY, KRW, EUR)
   * @returns 총 비용
   */
  async calculateTotalExpenses(
    planId: number,
    targetCurrency: Currency,
  ): Promise<number> {
    const plan = await this.planRepository.findPlanWithDetailByPlanId(planId);

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
  async updateTotalExpenses(planId: number): Promise<void> {
    try {
      const totalExpenses = await this.calculateTotalExpenses(
        planId,
        Currency.KRW,
      );
      console.log(`전체 비용 계산 ${planId}: ${totalExpenses}`);

      await this.planRepository.updateTotalExpenses(planId, totalExpenses);
      console.log(`전체 비용 업데이트 됨 ${planId}`);
    } catch (error) {
      console.error(`전체비용 업데이트 안됨 ${planId}:`, error);
      throw error;
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
    const alreadyLiked = await this.avatarLikePlanRepository.hasUserLikedPlan(
      planId,
      avatarId,
    );

    if (alreadyLiked) {
      throw new ConflictException('이미 좋아요를 누른 여행 계획입니다.');
    }

    await this.avatarLikePlanRepository.addLike(planId, avatarId);
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
  async softDeleteLike(
    planId: number,
    avatarId: number,
  ): Promise<{ message: string; plan: PlanEntity }> {
    const alreadyLiked = await this.avatarLikePlanRepository.hasUserLikedPlan(
      planId,
      avatarId,
    );

    if (!alreadyLiked) {
      throw new BadRequestException('좋아요를 누르지 않은 여행 계획입니다.');
    }

    await this.avatarLikePlanRepository.softDeleteLike(planId, avatarId);
    const plan = await this.findPlanById(planId);

    if (!plan) {
      throw new NotFoundException('여행 계획을 찾을 수 없습니다.');
    }

    return { message: '좋아요가 추가되었습니다.', plan };
  }
}
