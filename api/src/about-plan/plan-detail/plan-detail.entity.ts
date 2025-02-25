import { IsEnum, IsString, Matches } from 'class-validator';
import { CommonEntity } from 'src/common/entity/common.entity';
import { Currency } from 'src/common/enum/currency';
import { PriceType } from 'src/common/enum/priceType';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LocationEntity } from '../location/location.entity';
import { PlanEntity } from '../plan/plan.entity';

@Entity('plan_detail')
export class PlanDetailEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  detailId: number;

  @Column({ nullable: false })
  @IsString()
  @Matches(/^\d{12}$/, {
    message: 'startTime 은 YYYYMMDDHHMM 형태의 string으로 입력받아야 합니다.',
  })
  startTime: string;

  @Column({ nullable: false })
  @IsString()
  @Matches(/^\d{12}$/, {
    message: 'endTime 은 YYYYMMDDHHMM 형태의 string으로 입력받아야 합니다.',
  })
  endTime: string;

  @Column({ nullable: false })
  detailTitle: string;

  @Column({ nullable: true })
  price: number;

  @IsEnum(PriceType)
  @Column({ default: PriceType.OTHER })
  priceType: PriceType;

  @IsEnum(Currency)
  @Column({
    default: Currency.KRW,
  })
  currency: Currency;

  @Column({ nullable: true })
  notes: string;

  @ManyToOne(() => PlanEntity, (plan) => plan.details)
  @JoinColumn({ name: 'planId' })
  plan: PlanEntity;

  @ManyToOne(() => LocationEntity, (location) => location.details, {
    nullable: true,
  })
  @JoinColumn({ name: 'locationId' })
  location: LocationEntity;
}
