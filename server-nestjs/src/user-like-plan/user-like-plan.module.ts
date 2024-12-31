import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLikePlanEntity } from './user-like-plan.entity';
import { UserLikePlanRepository } from './user-like-plan.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserLikePlanEntity])],
  providers: [UserLikePlanRepository],
  exports: [UserLikePlanRepository],
})
export class UserLikePlanModule {}
