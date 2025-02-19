import { CommonEntity } from 'src/common/entity/common.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DestinationTagEntity } from '../destination-tag/destination-tag.entity';
import { PlanEntity } from '../plan/plan.entity';

@Entity('plan_destination')
export class PlanDestinationEntity extends CommonEntity {
  @PrimaryColumn()
  destinationTagId: number;

  @PrimaryColumn()
  planId: number;

  @ManyToOne(
    () => DestinationTagEntity,
    (destination) => destination.categories,
  )
  @JoinColumn({ name: 'destinationTagId' })
  destinationTag: DestinationTagEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.destinations)
  @JoinColumn({ name: 'planId' })
  plan: PlanEntity;
}
