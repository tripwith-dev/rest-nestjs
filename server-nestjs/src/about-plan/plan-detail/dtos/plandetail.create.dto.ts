import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { PlanDetailEntity } from '../plan-detail.entity';

export class CreatePlanDetailDto extends PickType(PlanDetailEntity, [
  'detailTitle',
  'startTime',
  'endTime',
  'notes',
  'currency',
  'price',
] as const) {
  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{12}$/, {
    message: 'startTime 은 YYYYMMDDHHMM 형태의 string으로 입력받아야 합니다.',
  })
  startTime: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d{12}$/, {
    message: 'endTime 은 YYYYMMDDHHMM 형태의 string으로 입력받아야 합니다.',
  })
  endTime: string;
}
