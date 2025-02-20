import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlanDetailEntity } from '../plan-detail/plan-detail.entity';
import { LocationTypeMappingEntity } from './location-type-mapping.entity';

@Entity('location')
export class LocationEntity {
  @PrimaryGeneratedColumn()
  locationId: number;

  @Column({ nullable: false, unique: true })
  placeId: string;

  @Column({ nullable: true })
  locationName: string;

  @Column({ nullable: false })
  address: string;

  @Column({ nullable: false })
  latitude: string;

  @Column({ nullable: false })
  longitude: string;

  @Column({ default: null })
  locationRating: number;

  @OneToMany(() => PlanDetailEntity, (detail) => detail.plan)
  details: PlanDetailEntity[];

  @OneToMany(() => LocationTypeMappingEntity, (mapping) => mapping.location, {
    cascade: true,
  })
  typeMappings: LocationTypeMappingEntity[];
}
