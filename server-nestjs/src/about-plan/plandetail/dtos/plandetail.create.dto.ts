import { PickType } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { Currency, PlanDetailEntity } from '../plandetail.entity';

export class CreatePlanDetailDto extends PickType(PlanDetailEntity, [
  'detailTitle',
  'startTime',
  'endTime',
] as const) {
  @IsNotEmpty()
  @IsString()
  detailTitle: string;

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

  @IsOptional()
  @IsNumber()
  price?: number;

  @IsEnum(Currency)
  @IsOptional()
  currency?: Currency;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  latitude?: string;

  @IsOptional()
  @IsString()
  longitude?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
