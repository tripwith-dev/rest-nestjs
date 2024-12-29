import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { DestinationEntity } from '../destination/destination.entity';
import { PlanEntity } from '../plan/plan.entity';

@Entity('plandestination')
export class PlanDestinationEntity {
  @PrimaryColumn()
  destinationId: number;

  @PrimaryColumn()
  planId: number;

  @ManyToOne(() => DestinationEntity, (destination) => destination.categories)
  @JoinColumn({ name: 'destinationId' })
  destination: DestinationEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.destinations)
  @JoinColumn({ name: 'planId' })
  plan: PlanEntity;
}
