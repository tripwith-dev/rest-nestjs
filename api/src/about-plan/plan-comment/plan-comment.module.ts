import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanModule } from '../plan/plan.module';
import { PlanCommentController } from './plan-comment.controller';
import { PlanCommentEntity } from './plan-comment.entity';
import { PlanCommentRepository } from './plan-comment.repository';
import { PlanCommentService } from './plan-comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlanCommentEntity]), PlanModule],
  controllers: [PlanCommentController],
  providers: [PlanCommentService, PlanCommentRepository],
})
export class PlanCommentModule {}
