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

  async softDeletePlanDestinations(
    planDestinations: PlanDestinationEntity[],
  ): Promise<void> {
    if (planDestinations && planDestinations.length > 0) {
      const updatedDestinations = planDestinations.map((destination) => ({
        ...destination,
        deletedAt: new Date(),
        isDeleted: true,
      }));

      await this.repository.save(updatedDestinations);
    }
  }
}
