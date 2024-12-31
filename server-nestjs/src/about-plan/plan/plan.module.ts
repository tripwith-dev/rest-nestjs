import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlanEntity } from './plan.entity';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';

@Module({ imports: [TypeOrmModule.forFeature([PlanEntity])], controllers: [PlanController], providers: [PlanService] })
export class PlanModule {}
