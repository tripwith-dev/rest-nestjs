import { IsEnum } from 'class-validator';
import { CommonEntity } from 'src/common/entity/common.entity';
import { Currency } from 'src/common/enum/currency';
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
  startTime: string;

  @Column({ nullable: false })
  endTime: string;

  @Column({ nullable: false })
  detailTitle: string;

  @Column({ nullable: true })
  price?: number;

  @IsEnum(Currency)
  @Column({
    type: 'enum',
    enum: Currency,
    nullable: true,
    default: Currency.KRW,
  })
  currency?: Currency;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => PlanEntity, (plan) => plan.details)
  @JoinColumn({ name: 'planId' })
  plan: PlanEntity;

  @ManyToOne(() => LocationEntity, (location) => location.details)
  @JoinColumn({ name: 'locationId' })
  location: LocationEntity;
}
