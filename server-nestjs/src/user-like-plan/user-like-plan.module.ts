import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLikePlanEntity } from './user-like-plan.entity';

@Module({ imports: [TypeOrmModule.forFeature([UserLikePlanEntity])] })
export class UserLikePlanModule {}
