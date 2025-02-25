import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlanTagEntity } from '../plan-tag/plan-tag.entity';
import { PlanEntity } from '../plan/plan.entity';
import { PlanTagMappingEntity } from './plan-tag-mapping.entity';

@Injectable()
export class PlanTagMappingRepository {
  constructor(
    @InjectRepository(PlanTagMappingEntity)
    private readonly repository: Repository<PlanTagMappingEntity>,
  ) {}
  async createPlanDestination(plan: PlanEntity, planTag: PlanTagEntity) {
    const categoryDestination = this.repository.create({
      plan,
      planTag,
    });

    return await this.repository.save(categoryDestination);
  }

  async deletePlanDestinations(
    planTagMapping: PlanTagMappingEntity[],
  ): Promise<void> {
    if (!planTagMapping || planTagMapping.length === 0) {
      return;
    }

    // 복합 키를 올바르게 넘겨서 삭제
    await Promise.all(
      planTagMapping.map((planTag) =>
        this.repository.delete({
          planId: planTag.planId,
          pTagId: planTag.pTagId,
        }),
      ),
    );
  }
}
