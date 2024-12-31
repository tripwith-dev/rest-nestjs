import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { timeSince } from 'src/utils/timeSince';
import { Repository, UpdateResult } from 'typeorm';
import { CategoryEntity } from '../category/category.entity';
import { CreatePlanDto } from './dto/plan.create.dto';
import { UpdatePlanDto } from './dto/plan.update.dto';
import { PlanEntity } from './plan.entity';

@Injectable()
export class PlanRepository {
  constructor(
    @InjectRepository(PlanEntity)
    private readonly repository: Repository<PlanEntity>,
  ) {}

  /**
   * 여행 컨테이너를 생성하는 리포지토리 로직
   * @param user 사용자 엔티티
   * @param createTravelPlanDto 여행 컨테이너 생성 DTO
   * @returns 생성된 여행 컨테이너 엔티티를 반환
   */
  async createTravelPlan(
    category: CategoryEntity,
    createTravelPlanDto: CreatePlanDto,
  ): Promise<PlanEntity> {
    const travelPlan = this.repository.create({
      ...createTravelPlanDto,
      category,
    });
    return await this.repository.save(travelPlan);
  }

  /**
   * 특정 여행 계획을 조회하는 리포지토리 로직
   * @param planId 여행 계획 ID
   * @returns 조회된 여행 계획 엔티티를 반환
   */
  async findPlanById(planId: number): Promise<PlanEntity | undefined> {
    const travelContainer = await this.repository
      .createQueryBuilder('travelplan')
      .leftJoinAndSelect('travelplan.category', 'category')
      .leftJoinAndSelect('travelplan.destinations', 'planDestinations')
      .leftJoinAndSelect('planDestinations.destination', 'destination')
      .where('travelplan.planId = :planId', { planId })
      .andWhere('category.isDeleted = false')
      .andWhere('travelplan.isDeleted = false')
      .getOne();

    // createdTimeSince 필드를 timeSince 함수로 변환하여 반환
    if (travelContainer) {
      return {
        ...travelContainer,
        createdTimeSince: timeSince(travelContainer.createdAt),
      };
    }
  }

  async findTopTenTravelPlan(): Promise<PlanEntity[]> {
    const travelPlans = await this.repository
      .createQueryBuilder('travelplan')
      .leftJoinAndSelect('travelplan.category', 'category')
      .leftJoinAndSelect('travelplan.destinations', 'planDestinations')
      .leftJoinAndSelect('planDestinations.destination', 'destination')
      .where('category.isDeleted = false')
      .andWhere('travelplan.isDeleted = false')
      .andWhere('travelplan.status = :status', { status: 'PUBLIC' })
      .orderBy('travelplan.likesCount', 'DESC')
      .addOrderBy('travelplan.createdAt', 'DESC')
      .limit(10)
      .getMany();

    return travelPlans.map((plan) => ({
      ...plan,
      createdTimeSince: timeSince(plan.createdAt),
    }));
  }

  async findAllTravelPlans(): Promise<PlanEntity[]> {
    const travelPlans = await this.repository
      .createQueryBuilder('travelplan')
      .leftJoinAndSelect('travelplan.category', 'category')
      .leftJoinAndSelect('travelplan.destinations', 'planDestinations')
      .leftJoinAndSelect('planDestinations.destination', 'destination')
      .where('category.isDeleted = false')
      .andWhere('travelplan.isDeleted = false')
      .getMany();

    return travelPlans.map((plan) => ({
      ...plan,
      createdTimeSince: timeSince(plan.createdAt),
    }));
  }

  /**
   * 특정(+상태 PUBLIC인 카테고리) 여행 계획을 조회하는 리포지토리 로직
   * @param planId 여행 계획 ID
   * @returns 조회된 여행 계획 엔티티를 반환
   */
  async findOnePublicTravelPlan(
    planId: number,
  ): Promise<PlanEntity | undefined> {
    const travelContainer = await this.repository
      .createQueryBuilder('travelplan')
      .leftJoinAndSelect('travelplan.category', 'category')
      .where('travelplan.planId = :planId', { planId })
      .andWhere('category.isDeleted = false')
      .andWhere('travelplan.isDeleted = false')
      .getOne();

    // createdTimeSince 필드를 timeSince 함수로 변환하여 반환
    if (travelContainer) {
      return {
        ...travelContainer,
        createdTimeSince: timeSince(travelContainer.createdTimeSince),
      };
    }
  }

  /**
   * 특정 카테고리의 모든 여행 계획을 조회하는 리포지토리 로직
   * @param categoryId 카테고리 id
   * @returns 특정 카테고리의 여행 계획 엔티티 배열을 반환
   */
  async findPlansByCategoryId(categoryId: number): Promise<PlanEntity[]> {
    const travelPlans = await this.repository
      .createQueryBuilder('travelplan')
      .leftJoinAndSelect('travelplan.category', 'category')
      .where('category.categoryId = :categoryId', { categoryId })
      .andWhere('category.isDeleted = false')
      .andWhere('travelplan.isDeleted = false')
      .getMany();

    // 각 여행 계획의 createdTimeSince 필드를 timeSince 함수로 변환
    if (travelPlans && travelPlans.length > 0) {
      return travelPlans.map((plan) => ({
        ...plan,
        createdTimeSince: timeSince(plan.createdAt),
      }));
    }

    return [];
  }

  /**
   * 특정 여행 계획을 업데이트하는 리포지토리 로직
   * @param planId 여행 계획 ID
   * @param updateTravelPlanDto 업데이트 데이터 DTO
   * @returns void
   */
  async updatePlan(
    planId: number,
    updateTravelPlanDto: UpdatePlanDto,
  ): Promise<void> {
    await this.repository.update(planId, {
      ...updateTravelPlanDto,
      isUpdated: true,
      updatedAt: new Date(),
    });
  }

  /**
   * 특정 여행 계획의 totalExpenses를 업데이트하는 리포지토리 로직
   * @param planId 여행 계획 ID
   * @param totalExpenses 업데이트할 총 비용
   * @returns void
   */
  async updateTotalExpenses(
    planId: number,
    totalExpenses: number,
  ): Promise<void> {
    await this.repository.update(planId, {
      totalExpenses,
      isUpdated: true,
      updatedAt: new Date(),
    });
  }

  /**
   * 특정 여행 컨테이너를 소프트 삭제하는 리포지토리 로직
   * @param planId 여행 계획 ID
   * @returns void
   */
  async softDeletedTravelPlan(planId: number): Promise<void> {
    await this.repository.update(planId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }

  /**
   * 특정 여행 계획의의 모든 detail들의 위치와 제목 정보를 가져옴
   * @param planId 여행 계획 ID
   * @returns 여행 디테일의 장소(location)와 위치(title) 배열을 반환
   */
  async findDetailTitlesAndLocationOfPlan(planId: number): Promise<PlanEntity> {
    return await this.repository
      .createQueryBuilder('travelPlan')
      .leftJoinAndSelect('travelPlan.details', 'detail')
      .where('travelPlan.planId = :planId', { planId })
      .andWhere('travelPlan.isDeleted = false')
      .andWhere('(detail.isDeleted = false OR detail.detailId IS NULL)')
      .orderBy('detail.endTime', 'ASC')
      .getOne();
  }

  /**
   * 특정 여행 계획의 여행 디테일들의 가격들을 반환
   * @param planId 여행 계획 ID
   * @returns 여행 디테일 엔티티 배열을 반환
   */
  async findDetailsPriceForContainer(planId: number): Promise<PlanEntity> {
    const plan = await this.repository
      .createQueryBuilder('travelplan')
      .leftJoinAndSelect('travelplan.details', 'detail')
      .where('travelplan.planId = :planId', { planId })
      .andWhere('travelplan.isDeleted = false')
      .andWhere('detail.isDeleted = false')
      // travelStartDate, travelEndDate와 detail의 YYYYMMDD 부분만 비교
      // 아래 로직 때문에 plan 자체가 null로 반환될 수도 있음.
      .andWhere(
        'SUBSTRING(detail.startTime, 1, 8) >= travelplan.travelStartDate',
      )
      .andWhere('SUBSTRING(detail.endTime, 1, 8) <= travelplan.travelEndDate')
      .andWhere('(detail.isDeleted = false OR detail.detailId IS NULL)')
      .select([
        'travelplan.planId',
        'travelplan.travelStartDate',
        'travelplan.travelEndDate',
        'travelplan.isDeleted',
        'detail.detailId',
        'detail.price',
        'detail.currency',
        'detail.startTime',
        'detail.endTime',
        'detail.isDeleted',
      ])
      .getOne();

    // details가 없을 경우 빈 배열을 할당
    if (plan && !plan.details) {
      plan.details = [];
    }

    return plan;
  }

  async updateMainImage(
    categoryId: number,
    mainImageUrl: string,
  ): Promise<UpdateResult> {
    return await this.repository.update(categoryId, {
      planMainImage: mainImageUrl,
      isUpdated: true,
      updatedAt: new Date(),
    });
  }

  /**
   * plan 메인 이미지 삭제
   * @param plan
   * @returns 업데이트된 category 엔티티
   */
  async deleteMainImage(plan: PlanEntity): Promise<UpdateResult> {
    return await this.repository
      .createQueryBuilder()
      .update(PlanEntity)
      .set({ planMainImage: null })
      .where('planId = :planId', { planId: plan.planId })
      .execute();
  }
}
