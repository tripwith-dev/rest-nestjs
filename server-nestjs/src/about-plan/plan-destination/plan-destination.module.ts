import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanDestinationEntity } from './plan-destination.entity';
import { PlanDestinationService } from './plan-destination.service';

@Module({ imports: [TypeOrmModule.forFeature([PlanDestinationEntity])], providers: [PlanDestinationService] })
export class PlanDestinationModule {}
