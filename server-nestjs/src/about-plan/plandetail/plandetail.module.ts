import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanModule } from '../plan/plan.module';
import { PlanDetailController } from './plandetail.controller';
import { PlanDetailEntity } from './plandetail.entity';
import { PlanDetailRepository } from './plandetail.repository';
import { PlanDetailService } from './plandetail.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlanDetailEntity]), PlanModule],
  controllers: [PlanDetailController],
  providers: [PlanDetailService, PlanDetailRepository],
  exports: [PlanDetailService, PlanDetailRepository],
})
export class PlanDetailModule {}
