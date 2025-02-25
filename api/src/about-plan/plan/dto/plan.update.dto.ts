import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PlanEntity } from '../plan.entity';

export class UpdatePlanDto extends PickType(PlanEntity, [
  'planTitle',
  'status',
  'travelStartDate',
  'travelEndDate',
] as const) {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{8}$/, {
    message: 'travelStartDate must be a valid YYYYMMDD format string',
  })
  travelStartDate: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{8}$/, {
    message: 'travelEndDate must be a valid YYYYMMDD format string',
  })
  travelEndDate: string;
}
