import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DestinationEntity } from '../destination/destination.entity';
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
    destination: DestinationEntity,
  ) {
    const categoryDestination = this.repository.create({
      plan: travelPlan,
      destination,
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
