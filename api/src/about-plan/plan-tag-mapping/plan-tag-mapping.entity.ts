import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { PlanTagEntity } from '../plan-tag/plan-tag.entity';
import { PlanEntity } from '../plan/plan.entity';

@Entity('plan_tag_mapping')
export class PlanTagMappingEntity {
  @PrimaryColumn()
  pTagId: number;

  @PrimaryColumn()
  planId: number;

  @ManyToOne(() => PlanTagEntity, (destination) => destination.pTagMappings)
  @JoinColumn({ name: 'pTagId' })
  planTag: PlanTagEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.tagMappings)
  @JoinColumn({ name: 'planId' })
  plan: PlanEntity;
}
