import { CommonEntity } from 'src/common/entity/common.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlanDetailEntity } from '../plan-detail/plan-detail.entity';

@Entity('location')
export class LocationEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  locationId: number;

  @Column({ nullable: true })
  locationName?: string;

  @Column({ nullable: true })
  latitude?: string;

  @Column({ nullable: true })
  longitude?: string;

  @OneToMany(() => PlanDetailEntity, (detail) => detail.plan)
  details: PlanDetailEntity[];
}
