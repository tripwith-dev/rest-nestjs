import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarLikePlanEntity } from './avatar-like-plan.entity';
import { AvatarLikePlanRepository } from './avatar-like-plan.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AvatarLikePlanEntity])],
  providers: [AvatarLikePlanRepository],
  exports: [AvatarLikePlanRepository],
})
export class AvatarLikePlanModule {}
