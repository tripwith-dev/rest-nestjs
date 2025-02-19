import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlanDestinationEntity } from '../plan-destination/plan-destination.entity';

@Entity('destination_tag')
export class DestinationTagEntity {
  @PrimaryGeneratedColumn()
  destinationTagId: number;

  @Column()
  destinationTagName: string;

  // 아래부터 FK
  @OneToMany(() => PlanDestinationEntity, (plan) => plan.destinationTag)
  categories: PlanDestinationEntity[];
}
