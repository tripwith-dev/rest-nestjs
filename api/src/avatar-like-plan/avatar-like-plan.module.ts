import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarLikePlanEntity } from './avatar-like-plan.entity';
import { AvatarLikePlanRepository } from './avatar-like-plan.repository';
import { AvatarLikePlanService } from './avatar-like-plan.service';

@Module({
  imports: [TypeOrmModule.forFeature([AvatarLikePlanEntity])],
  providers: [AvatarLikePlanService, AvatarLikePlanRepository],
  exports: [AvatarLikePlanService, AvatarLikePlanRepository],
})
export class AvatarLikePlanModule {}
