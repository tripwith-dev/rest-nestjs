import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { PlanEntity } from '../plan/plan.entity';
import { CreatePlanDetailDto } from './dtos/plandetail.create.dto';
import { UpdatePlanDetailDto } from './dtos/plandetail.update.dto';
import { PlanDetailEntity } from './plan-detail.entity';

@Injectable()
export class PlanDetailRepository {
  constructor(
    @InjectRepository(PlanDetailEntity)
    private readonly repository: Repository<PlanDetailEntity>,
  ) {}

  async createPlanDetail(
    plan: PlanEntity,
    createTravelDetailDto: CreatePlanDetailDto,
  ): Promise<PlanDetailEntity> {
    const detail = this.repository.create({
      ...createTravelDetailDto,
      plan,
    });
    return await this.repository.save(detail);
  }

  async findPlanDetailById(detailId: number): Promise<PlanDetailEntity> {
    const travelDetail = await this.repository
      .createQueryBuilder('plan_detail')
      .leftJoinAndSelect('plan_detail.plan', 'plan')
      .leftJoinAndSelect('plan_detail.location', 'location')
      .where('plan_detail.detailId = :detailId', { detailId })
      .andWhere('plan_detail.isDeleted = false')
      .andWhere('plan.isDeleted = false')
      .getOne();

    return travelDetail;
  }

  async findPlanDetailOwnerByDetailId(
    detailId: number,
  ): Promise<PlanDetailEntity> {
    const travelDetail = await this.repository
      .createQueryBuilder('plan_detail')
      .leftJoinAndSelect('plan_detail.plan', 'plan')
      .leftJoinAndSelect('plan_detail.location', 'location')
      .leftJoinAndSelect('plan.category', 'category')
      .leftJoinAndSelect('category.avatar', 'avatar')
      .where('plan_detail.detailId = :detailId', { detailId })
      .andWhere('plan_detail.isDeleted = false')
      .andWhere('plan.isDeleted = false')
      .getOne();

    return travelDetail;
  }

  async findAllPlanDetails(): Promise<PlanDetailEntity[]> {
    return await this.repository
      .createQueryBuilder('plan_detail')
      .leftJoinAndSelect('plan_detail.plan', 'plan')
      .leftJoinAndSelect('plan_detail.location', 'location')
      .where('plan_detail.isDeleted = false')
      .andWhere('plan.isDeleted = false')
      .getMany();
  }

  async updateTravelDetail(
    detailId: number,
    updateTravelDetailDto: UpdatePlanDetailDto,
  ): Promise<void> {
    await this.repository.update(detailId, updateTravelDetailDto);
  }

  async softDeletePlanDetail(detailId: number): Promise<void> {
    await this.repository.update(detailId, {
      isDeleted: true,
      deletedAt: new Date(),
    });
  }

  async delete(detailId: number): Promise<void> {
    await this.repository.delete(detailId);
  }

  async findOverlap(
    planId: number,
    startTime: string,
    endTime: string,
    excludeDetailId?: number,
  ): Promise<PlanDetailEntity[]> {
    const query = this.repository
      .createQueryBuilder('plan_detail')
      .leftJoinAndSelect('plan_detail.plan', 'plan')
      .where('plan_detail.planId = :planId', { planId })
      .andWhere(
        '(plan_detail.startTime < :endTime AND plan_detail.endTime > :startTime)',
        { startTime, endTime },
      );

    if (excludeDetailId) {
      query.andWhere('plan_detail.detailId != :excludeDetailId', {
        excludeDetailId,
      });
    }

    return await query.getMany();
  }

  async deleteOverlap(overlappingDetails: PlanDetailEntity[]): Promise<void> {
    for (const detail of overlappingDetails) {
      await this.softDeletePlanDetail(detail.detailId);
    }
  }

  async deleteIsDeletedTrue(thresholdDate: Date) {
    await this.repository.delete({
      isDeleted: true,
      deletedAt: LessThan(thresholdDate),
    });
  }
}
