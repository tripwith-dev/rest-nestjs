import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
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
  async createPlan(
    avatar: AvatarEntity,
    category: CategoryEntity,
    createTravelPlanDto: CreatePlanDto,
  ): Promise<PlanEntity> {
    const plan = this.repository.create({
      ...createTravelPlanDto,
      avatar,
      category,
    });
    return await this.repository.save(plan);
  }

  /**
   * 특정 여행 계획을 조회
   */
  async findPlanById(planId: number): Promise<PlanEntity | undefined> {
    const plan = await this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.tagMappings', 'tagMapping')
      .leftJoinAndSelect('tagMapping.planTag', 'planTag')
      .where('plan.planId = :planId', { planId })
      .andWhere('plan.isDeleted = false')
      .getOne();

    return plan;
  }

  async findPlanAllInfo(planId: number): Promise<PlanEntity | undefined> {
    const plan = await this.repository
      .createQueryBuilder('plan')
      .leftJoin('plan.avatar', 'avatar', 'avatar.isDeleted = false')
      .leftJoin('plan.category', 'category', 'category.isDeleted = false')
      .leftJoinAndSelect('plan.tagMappings', 'tagMapping')
      .leftJoinAndSelect('tagMapping.planTag', 'planTag')
      .where('plan.planId = :planId', { planId })
      .andWhere('plan.isDeleted = false')
      .addSelect(['avatar.avatarId', 'category.categoryId'])
      .getOne();

    return plan;
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
    return await this.repository
      .createQueryBuilder('plan')
      .leftJoin('plan.avatar', 'avatar', 'avatar.isDeleted = false')
      .leftJoin('plan.category', 'category', 'category.isDeleted = false')
      .leftJoinAndSelect('plan.tagMappings', 'tagMapping')
      .leftJoinAndSelect('tagMapping.planTag', 'planTag')
      .where('category.categoryId = :categoryId', { categoryId })
      .andWhere('plan.isDeleted = false')
      .addSelect(['avatar.avatarId'])
      .addSelect(['category.categoryId'])
      .getMany();
  }

  /**
   * 특정 여행 계획의 모든 detail 정보를 가져옴
   * plan 페이지에서 detail이 보여야 하기에 필요한 로직
   * @param planId
   * @returns
   */
  async findPlanWithDetail(planId: number): Promise<PlanEntity> {
    return await this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.avatar', 'avatar', 'avatar.isDeleted = false')
      .leftJoinAndSelect('plan.details', 'detail', 'detail.isDeleted = false')
      .leftJoinAndSelect('detail.location', 'location')
      .where('plan.planId = :planId', { planId })
      .andWhere('plan.isDeleted = false')
      .orderBy('detail.endTime', 'ASC')
      .getOne();
  }

  /**
   * 특정 여행 계획의 모든 detail 정보를 가져옴
   * plan 페이지에서 detail이 보여야 하기에 필요한 로직
   * @param planId
   * @returns
   */
  async findPlanWithAvatar(planId: number): Promise<PlanEntity> {
    return await this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.avatar', 'avatar', 'avatar.isDeleted = false')
      .where('plan.planId = :planId', { planId })
      .andWhere('plan.isDeleted = false')
      .getOne();
  }

  /**
   * 좋아요 top10
   * 동점일 경우 최신 순 조회
   * 메인페이지 배너에서 사용됨
   * 공개 플랜만 가능
   */
  async findPopularPlans(): Promise<PlanEntity[]> {
    const plans = await this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.avatar', 'avatar', 'avatar.isDeleted = false')
      .leftJoinAndSelect('plan.tagMappings', 'tagMapping')
      .leftJoinAndSelect('tagMapping.planTag', 'planTag')
      .andWhere('plan.isDeleted = false')
      .andWhere('plan.status = :status', { status: 'PUBLIC' })
      .orderBy('plan.likesCount', 'DESC')
      .addOrderBy('plan.createdAt', 'DESC')
      .limit(5)
      .getMany();

    return plans;
  }

  /**
   * <테스트용>
   * 모든 plan 조회
   */
  async findAllPlans(): Promise<PlanEntity[]> {
    const plans = await this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.tagMappings', 'tagMapping')
      .leftJoinAndSelect('tagMapping.planTag', 'planTag')
      .andWhere('plan.isDeleted = false')
      .orderBy('plan.updatedAt', 'DESC')
      .getMany();

    return plans;
  }

  /**
   * 특정 여행 계획을 업데이트
   */
  async updatePlan(
    planId: number,
    updatePlanDto: UpdatePlanDto,
  ): Promise<void> {
    await this.repository.update(planId, {
      ...updatePlanDto,
      updatedAt: new Date(),
    });
  }

  /**
   * 특정 여행 계획의 totalExpenses를 업데이트
   */
  async updateTotalExpenses(planId: number, totalPrice: number): Promise<void> {
    await this.repository.update(planId, {
      totalPrice,
      updatedAt: new Date(),
    });
  }

  /**
   * 특정 여행 컨테이너를 소프트 삭제
   */
  async softDeletedPlan(planId: number): Promise<void> {
    await this.repository.update(planId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }

  /**
   * 삭제된 plan 조회
   */
  async findDeletedPlanById(planId: number): Promise<PlanEntity | undefined> {
    const plan = await this.repository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.tagMappings', 'tagMapping')
      .leftJoinAndSelect('tagMapping.planTag', 'planTag')
      .where('plan.planId = :planId', { planId })
      .andWhere('plan.isDeleted = true')
      .getOne();

    return plan;
  }

  async replaceMainImage(
    planId: number,
    mainImageUrl: string,
  ): Promise<UpdateResult> {
    return await this.repository.update(planId, {
      planMainImage: mainImageUrl,
      updatedAt: new Date(),
    });
  }

  /**
   * plan 메인 이미지 삭제
   * @param plan
   * @returns 업데이트된 category 엔티티
   */
  async deleteMainImage(planId: number): Promise<UpdateResult> {
    return await this.repository
      .createQueryBuilder()
      .update(PlanEntity)
      .set({ planMainImage: 'uploads/planImages/default.png' })
      .where('planId = :planId', { planId })
      .execute();
  }
}
