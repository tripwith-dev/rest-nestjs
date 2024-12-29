import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlanDestinationEntity } from '../plan-destination/plan-destination.entity';

@Entity('destination')
export class DestinationEntity {
  @PrimaryGeneratedColumn()
  destinationId: number;

  @Column()
  destinationName: string;

  // 아래부터 FK
  @OneToMany(() => PlanDestinationEntity, (plan) => plan.destination)
  categories: PlanDestinationEntity[];
}
