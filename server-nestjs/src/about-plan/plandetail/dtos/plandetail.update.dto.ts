import { PartialType } from '@nestjs/mapped-types';
import { PlanDetailEntity } from '../plandetail.entity';

export class UpdatePlanDetailDto extends PartialType(PlanDetailEntity) {}
