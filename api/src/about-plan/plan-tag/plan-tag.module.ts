import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanTagEntity } from './plan-tag.entity';
import { PlanTagRepository } from './plan-tag.repository';
import { PlanTagService } from './plan-tag.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlanTagEntity])],
  providers: [PlanTagService, PlanTagRepository],
  exports: [PlanTagService, PlanTagRepository],
})
export class PlanTagModule {}
