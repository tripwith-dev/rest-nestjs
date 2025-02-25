import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DestinationTagEntity } from '../destination-tag/destination-tag.entity';
import { PlanEntity } from '../plan/plan.entity';
import { PlanDestinationEntity } from './plan-destination.entity';

@Injectable()
export class PlanDestinationRepository {
  constructor(
    @InjectRepository(PlanDestinationEntity)
    private readonly repository: Repository<PlanDestinationEntity>,
  ) {}
  async createPlanDestination(
    travelPlan: PlanEntity,
    destinationTag: DestinationTagEntity,
  ) {
    const categoryDestination = this.repository.create({
      plan: travelPlan,
      destinationTag,
    });

    return await this.repository.save(categoryDestination);
  }

  async deletePlanDestinations(
    planDestinations: PlanDestinationEntity[],
  ): Promise<void> {
    if (!planDestinations || planDestinations.length === 0) {
      return;
    }

    // 복합 키를 올바르게 넘겨서 삭제
    await Promise.all(
      planDestinations.map((destination) =>
        this.repository.delete({
          planId: destination.planId, // ✅ planId 포함
          destinationTagId: destination.destinationTagId, // ✅ destinationTagId 포함
        }),
      ),
    );
  }
}
