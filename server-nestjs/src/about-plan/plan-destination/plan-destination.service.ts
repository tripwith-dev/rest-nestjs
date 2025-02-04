import { Injectable } from '@nestjs/common';
import { DestinationEntity } from '../destination/destination.entity';
import { PlanEntity } from '../plan/plan.entity';
import { PlanDestinationEntity } from './plan-destination.entity';
import { PlanDestinationRepository } from './plan-destination.repository';

@Injectable()
export class PlanDestinationService {
  constructor(
    private readonly planDestinationRepository: PlanDestinationRepository,
  ) {}

  async createPlanDestination(
    plan: PlanEntity,
    destination: DestinationEntity,
  ) {
    return await this.planDestinationRepository.createPlanDestination(
      plan,
      destination,
    );
  }

  async softDeletePlanDestinations(
    planDestinations: PlanDestinationEntity[],
  ): Promise<void> {
    await this.planDestinationRepository.softDeletePlanDestinations(
      planDestinations,
    );
  }
}
