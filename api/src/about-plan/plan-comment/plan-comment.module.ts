import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanCommentController } from './plan-comment.controller';
import { PlanCommentEntity } from './plan-comment.entity';
import { PlanCommentService } from './plan-comment.service';

@Module({
  imports: [TypeOrmModule.forFeature([PlanCommentEntity])],
  controllers: [PlanCommentController],
  providers: [PlanCommentService],
})
export class PlanCommentModule {}
