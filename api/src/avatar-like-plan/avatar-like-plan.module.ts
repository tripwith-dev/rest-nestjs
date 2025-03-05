import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarLikePlanEntity } from './avatar-like-plan.entity';
import { AvatarLikePlanRepository } from './avatar-like-plan.repository';
import { AvatarLikePlanService } from './avatar-like-plan.service';
import { AvatarLikePlanController } from './avatar-like-plan.controller';
import { PlanModule } from 'src/about-plan/plan/plan.module';

@Module({
  imports: [TypeOrmModule.forFeature([AvatarLikePlanEntity]), PlanModule],
  providers: [AvatarLikePlanService, AvatarLikePlanRepository],
  exports: [AvatarLikePlanService, AvatarLikePlanRepository],
  controllers: [AvatarLikePlanController],
})
export class AvatarLikePlanModule {}
