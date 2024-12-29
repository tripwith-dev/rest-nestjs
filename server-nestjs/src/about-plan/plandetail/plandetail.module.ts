import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanDetailEntity } from './plandetail.entity';

@Module({ imports: [TypeOrmModule.forFeature([PlanDetailEntity])] })
export class PlanDetailModule {}
