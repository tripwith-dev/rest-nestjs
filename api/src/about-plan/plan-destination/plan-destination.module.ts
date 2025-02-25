import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DestinationTagModule } from '../destination-tag/destination-tag.module';
import { PlanDestinationEntity } from './plan-destination.entity';
import { PlanDestinationRepository } from './plan-destination.repository';
import { PlanDestinationService } from './plan-destination.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PlanDestinationEntity]),
    DestinationTagModule,
  ],
  providers: [PlanDestinationService, PlanDestinationRepository],
  exports: [PlanDestinationService, PlanDestinationRepository],
})
export class PlanDestinationModule {}
