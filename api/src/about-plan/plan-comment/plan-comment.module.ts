import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanCommentEntity } from './plan-comment.entity';

@Module({ imports: [TypeOrmModule.forFeature([PlanCommentEntity])] })
export class PlanCommentModule {}
