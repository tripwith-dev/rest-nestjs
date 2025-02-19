import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlanDetailEntity } from '../plan-detail/plan-detail.entity';

@Entity('location')
export class LocationEntity {
  @PrimaryGeneratedColumn()
  locationId: number;

  @Column({ nullable: false })
  locationName: string;

  @Column({ nullable: false })
  latitude: string;

  @Column({ nullable: false })
  longitude: string;

  @OneToMany(() => PlanDetailEntity, (detail) => detail.plan)
  details: PlanDetailEntity[];
}
