import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanDestinationEntity } from './plan-destination.entity';
import { PlanDestinationRepository } from './plan-destination.repository';
import { PlanDestinationService } from './plan-destination.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlanDestinationEntity])],
  providers: [PlanDestinationService, PlanDestinationRepository],
  exports: [PlanDestinationService, PlanDestinationRepository],
})
export class PlanDestinationModule {}
