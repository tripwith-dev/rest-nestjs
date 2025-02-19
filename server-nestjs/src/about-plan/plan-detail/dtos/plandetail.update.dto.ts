import { PartialType } from '@nestjs/mapped-types';
import { PlanDetailEntity } from '../plan-detail.entity';

export class UpdatePlanDetailDto extends PartialType(PlanDetailEntity) {}
