import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PlanEntity } from '../plan.entity';

export class CreatePlanDto extends PickType(PlanEntity, [
  'planTitle',
  'status',
  'travelStartDate',
  'travelEndDate',
  'destinations',
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
