import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { UserLikePlanRepository } from 'src/user-like-plan/user-like-plan.repository';
import { convertTotalExpenses } from 'src/utils/convertTotalExpenses';
import { CategoryService } from '../category/category.service';
import { DestinationService } from '../destination/destination.service';
import { PlanDestinationService } from '../plan-destination/plan-destination.service';
import { Currency } from '../plandetail/plandetail.entity';
import { UpdatePlanWithDestinationDto } from './dto/plan-destination.update.dto';
import { CreatePlanDto } from './dto/plan.create.dto';
import { UpdatePlanDto } from './dto/plan.update.dto';
import { PlanEntity } from './plan.entity';
import { PlanRepository } from './plan.repository';

@Injectable()
export class PlanService {
  constructor(
    private readonly travelPlanRepository: PlanRepository,
    private readonly travelCategoryService: CategoryService,
    private readonly destinationService: DestinationService,
    private readonly planDestinationService: PlanDestinationService,
    private readonly userPlanLikeRepository: UserLikePlanRepository,
  ) {}

  async createTravelPlan(
    categoryId: number,
    createTravelPlanDto: CreatePlanDto,
  ): Promise<PlanEntity> {
    const category =
      await this.travelCategoryService.findCategoryById(categoryId);

    if (
      createTravelPlanDto.planTitle &&
      createTravelPlanDto.planTitle.length > 30
    ) {
      throw new BadRequestException(`계획 제목은 30자 이내입니다.`);
    }

    await this.checkDuplicateTitle(categoryId, createTravelPlanDto.planTitle);

    this.validateDates(
      createTravelPlanDto.travelStartDate,
      createTravelPlanDto.travelEndDate,
    );

    const travelPlan = await this.travelPlanRepository.createTravelPlan(
      category,
      createTravelPlanDto,
    );

    // 여행지 데이터 처리
    if (
      createTravelPlanDto.destinations &&
      createTravelPlanDto.destinations.length > 0
    ) {
      for (const destination of createTravelPlanDto.destinations) {
        const destinationName = destination.destination.destinationName;

        // Destination이 이미 존재하는지 확인
        let destinationEntity =
          await this.destinationService.findOneByDestinationName(
            destinationName,
          );

        // 존재하지 않는다면 새로 생성
        if (!destinationEntity) {
          destinationEntity =
            await this.destinationService.createDestination(destinationName);
        }

        // CategoryDestination 관계 생성
        await this.planDestinationService.createPlanDestination(
          travelPlan,
          destinationEntity,
        );
      }
    }

    return await this.findPlanById(travelPlan.planId);
  }

  async findPlanById(
    planId: number,
    currency: Currency = Currency.KRW,
  ): Promise<PlanEntity | undefined> {
    const travelPlan = await this.travelPlanRepository.findPlanById(planId);

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

  async findTopTenTravelPlan(
    currency: Currency = Currency.KRW,
  ): Promise<PlanEntity[]> {
    const travelPlans = await this.travelPlanRepository.findTopTenTravelPlan();

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

  async findAllTravelPlans(
    currency: Currency = Currency.KRW,
  ): Promise<PlanEntity[]> {
    const travelPlans = await this.travelPlanRepository.findAllTravelPlans();

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
   * 특정 여행 컨테이너를 업데이트하는 서비스 로직
   * @param planId 여행 계획 ID
   * @param updateTravelContainerDto 여행 컨테이너 업데이트 DTO
   * @returns 업데이트된 여행 컨테이너 객체를 반환
   */
  async updateTravelPlan(
    planId: number,
    updatePlanWithDestinationDto: UpdatePlanWithDestinationDto,
  ): Promise<PlanEntity> {
    const plan = await this.findPlanById(planId);
    if (plan) {
      // 변경 사항이 있는지 체크(변경 사항이 없으면 기존 plan 반환)
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
      await this.travelPlanRepository.updatePlan(planId, planData);

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
   * 카테고리의 destination 태그를 업데이트하는 메서드
   * @param category - 업데이트 대상 카테고리 엔티티
   * @param newDestinations - 업데이트할 destination 목록
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
   * 특정 여행 계획을 소프트 삭제하는 서비스 로직
   * @param planId 여행 계획 ID
   * @returns void
   */
  async softDeletedTravelPlan(planId: number): Promise<any> {
    const travelPlan = await this.findPlanById(planId);
    if (travelPlan) {
      await this.travelPlanRepository.softDeletedTravelPlan(planId);
      return { message: '성공적으로 삭제되었습니다.' };
    } else {
      throw new InternalServerErrorException(
        `${planId}에 해당하는 여행 계획을 삭제할 수 없습니다.`,
      );
    }
  }

  /**
   * plan을 생성 할 때, 동일 카테고리 내에 중복되는 plan title이 있는지 확인
   * @param categoryId 카테고리 ID
   * @param planTitle 계획 제목
   * @returns void
   */
  private async checkDuplicateTitle(
    categoryId: number,
    planTitle: string,
  ): Promise<void> {
    const existingPlans =
      await this.travelPlanRepository.findPlansByCategoryId(categoryId);

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
   * @param categoryId 카테고리 ID
   * @param planId 제외할 계획 ID (업데이트할 계획 ID)
   * @param planTitle 컨테이너 제목
   * @returns void
   */
  private async checkDuplicateTitleWhenUpdate(
    categoryId: number,
    planId: number,
    planTitle: string,
  ): Promise<void> {
    const existingPlans =
      await this.travelPlanRepository.findPlansByCategoryId(categoryId);

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
  private hasChanges(plan: PlanEntity, updateDto: UpdatePlanDto): boolean {
    return (
      (updateDto.planTitle && plan.planTitle !== updateDto.planTitle) ||
      (updateDto.travelStartDate &&
        plan.travelStartDate !== updateDto.travelStartDate) ||
      (updateDto.travelEndDate &&
        plan.travelEndDate !== updateDto.travelEndDate)
    );
  }

  /**
   * 특정 여행 계획에 속한 여행 디테일들의 제목을 조회하는 서비스 로직
   * @param planId 여행 계획 ID
   * @returns 여행 디테일 제목 리스트를 반환
   */
  async findDetailTitlesAndLocationOfPlan(planId: number) {
    return await this.travelPlanRepository.findDetailTitlesAndLocationOfPlan(
      planId,
    );
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
    const plan =
      await this.travelPlanRepository.findDetailsPriceForContainer(planId);

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

      await this.travelPlanRepository.updateTotalExpenses(
        planId,
        totalExpenses,
      );
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
  async addMainImage(
    planId: number,
    mainImageUrl: string,
  ): Promise<PlanEntity> {
    await this.travelPlanRepository.updateMainImage(planId, mainImageUrl);
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

    await this.travelPlanRepository.deleteMainImage(plan);
    return await this.findPlanById(planId);
  }

  /**
   * 여행 계획에 좋아요 추가
   * @param planId 여행 계획 ID
   * @param userId 사용자 ID
   */
  async addLike(planId: number, userId: number): Promise<{ message: string }> {
    const alreadyLiked = await this.userPlanLikeRepository.hasUserLikedPlan(
      planId,
      userId,
    );

    if (alreadyLiked) {
      throw new ConflictException('이미 좋아요를 누른 여행 계획입니다.');
    }

    await this.userPlanLikeRepository.addLike(planId, userId);

    return { message: '좋아요가 추가되었습니다.' };
  }

  /**
   * 여행 계획에서 좋아요 제거
   * @param planId 여행 계획 ID
   * @param userId 사용자 ID
   */
  async removeLike(
    planId: number,
    userId: number,
  ): Promise<{ message: string }> {
    const alreadyLiked = await this.userPlanLikeRepository.hasUserLikedPlan(
      planId,
      userId,
    );

    if (!alreadyLiked) {
      throw new BadRequestException('좋아요를 누르지 않은 여행 계획입니다.');
    }

    await this.userPlanLikeRepository.removeLike(planId, userId);

    return { message: '좋아요가 제거되었습니다.' };
  }
}
