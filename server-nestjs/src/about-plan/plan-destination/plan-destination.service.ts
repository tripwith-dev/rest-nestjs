import { Injectable } from '@nestjs/common';
import { DestinationTagEntity } from '../destination-tag/destination-tag.entity';
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
    destination: DestinationTagEntity,
  ) {
    return await this.planDestinationRepository.createPlanDestination(
      plan,
      destination,
    );
  }

  async deletePlanDestinations(
    planDestinations: PlanDestinationEntity[],
  ): Promise<void> {
    await this.planDestinationRepository.deletePlanDestinations(
      planDestinations,
    );
  }
}
