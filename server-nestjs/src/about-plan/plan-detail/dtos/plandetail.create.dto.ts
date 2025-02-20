import { PickType } from '@nestjs/swagger';
import { PlanDetailEntity } from '../plan-detail.entity';

export class CreateDetailDto extends PickType(PlanDetailEntity, [
  'detailTitle',
  'startTime',
  'endTime',
  'notes',
  'price',
  'currency',
]) {}
