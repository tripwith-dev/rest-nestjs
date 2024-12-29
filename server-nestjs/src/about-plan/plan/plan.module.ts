import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './plan.entity';

@Module({ imports: [TypeOrmModule.forFeature([PlanEntity])] })
export class PlanModule {}
