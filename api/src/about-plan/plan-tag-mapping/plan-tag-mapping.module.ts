import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanTagModule } from '../plan-tag/plan-tag.module';
import { PlanTagMappingEntity } from './plan-tag-mapping.entity';
import { PlanTagMappingRepository } from './plan-tag-mapping.repository';
import { PlanTagMappingService } from './plan-tag-mapping.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlanTagMappingEntity]), PlanTagModule],
  providers: [PlanTagMappingService, PlanTagMappingRepository],
  exports: [PlanTagMappingService, PlanTagMappingRepository],
})
export class PlanTagMappingModule {}
