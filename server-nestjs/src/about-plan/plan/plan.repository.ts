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
   * 여행 계획 생성
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
   * 특정 여행 계획을 조회
   */
  async findPlanById(planId: number): Promise<PlanEntity | undefined> {
    const travelContainer = await this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.destinations', 'planDestinations')
      .leftJoinAndSelect('planDestinations.destination', 'destination')
      .where('plan.planId = :planId', { planId })
      .andWhere('plan.isDeleted = false')
      .getOne();

    // createdTimeSince 필드를 timeSince 함수로 변환하여 반환
    if (travelContainer) {
      return {
        ...travelContainer,
        createdTimeSince: timeSince(travelContainer.createdAt),
      };
    }

    return null;
  }

  /**
   * 특정 여행 계획과 카테고리까지 조회
   * 업데이트 시에 중복 확인을 위해서 사용
   */
  async findPlanWithCategoryById(
    planId: number,
  ): Promise<PlanEntity | undefined> {
    const travelContainer = await this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.category', 'category')
      .leftJoinAndSelect('plan.destinations', 'planDestinations')
      .leftJoinAndSelect('planDestinations.destination', 'destination')
      .where('plan.planId = :planId', { planId })
      .andWhere('category.isDeleted = false')
      .andWhere('plan.isDeleted = false')
      .getOne();

    // createdTimeSince 필드를 timeSince 함수로 변환하여 반환
    if (travelContainer) {
      return {
        ...travelContainer,
        createdTimeSince: timeSince(travelContainer.createdAt),
      };
    }
  }

  /**
   * 좋아요 top10
   * 동점일 경우 최신 순 조회
   * 메인페이지 배너에서 사용됨
   */
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

  /**
   * <테스트용>
   * 모든 plan 조회
   */
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
   * 특정 카테고리의 모든 여행 계획을 조회
   * 카테고리 내에 중복되는 planTitle이 있는지 확인할 때 사용
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
   * 특정 여행 계획을 업데이트
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
   * 특정 여행 계획의 totalExpenses를 업데이트
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
   * 특정 여행 컨테이너를 소프트 삭제
   */
  async softDeletedTravelPlan(planId: number): Promise<void> {
    await this.repository.update(planId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }

  /**
   * 삭제된 plan 조회
   */
  async findDeletedPlanById(planId: number): Promise<PlanEntity | undefined> {
    const travelContainer = await this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.destinations', 'planDestinations')
      .leftJoinAndSelect('planDestinations.destination', 'destination')
      .where('plan.planId = :planId', { planId })
      .andWhere('plan.isDeleted = true')
      .getOne();

    if (travelContainer) {
      return {
        ...travelContainer,
        createdTimeSince: timeSince(travelContainer.createdAt),
      };
    }

    return null;
  }

  /**
   * 특정 여행 계획의 모든 detail 정보를 가져옴
   * plan 페이지에서 detail이 보여야 하기에 필요한 로직
   */
  async findPlanWithDetailByPlanId(planId: number): Promise<PlanEntity> {
    return await this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.details', 'detail')
      .where('plan.planId = :planId', { planId })
      .andWhere('plan.isDeleted = false')
      .andWhere('(detail.isDeleted = false OR detail.detailId IS NULL)')
      .orderBy('detail.endTime', 'ASC')
      .getOne();
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
