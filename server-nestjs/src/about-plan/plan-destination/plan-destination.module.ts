import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanDestinationEntity } from './plan-destination.entity';

@Module({ imports: [TypeOrmModule.forFeature([PlanDestinationEntity])] })
export class PlanDestinationModule {}
