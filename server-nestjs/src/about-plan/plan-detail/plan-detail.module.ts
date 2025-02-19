import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanModule } from '../plan/plan.module';
import { PlanDetailController } from './plan-detail.controller';
import { PlanDetailEntity } from './plan-detail.entity';
import { PlanDetailRepository } from './plan-detail.repository';
import { PlanDetailService } from './plan-detail.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlanDetailEntity]), PlanModule],
  controllers: [PlanDetailController],
  providers: [PlanDetailService, PlanDetailRepository],
  exports: [PlanDetailService, PlanDetailRepository],
})
export class PlanDetailModule {}
