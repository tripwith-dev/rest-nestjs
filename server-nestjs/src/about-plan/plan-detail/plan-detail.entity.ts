import { IsEnum } from 'class-validator';
import { CommonEntity } from 'src/common/entity/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlanEntity } from '../plan/plan.entity';

export enum Currency {
  USD = 'USD',
  JPY = 'JPY',
  KRW = 'KRW',
  EUR = 'EUR',
}

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
  location?: string;

  @Column({ nullable: true })
  latitude?: string;

  @Column({ nullable: true })
  longitude?: string;

  @Column({ nullable: true })
  notes?: string;

  @ManyToOne(() => PlanEntity, (plan) => plan.details)
  @JoinColumn({ name: 'planId' })
  plan: PlanEntity;
}
