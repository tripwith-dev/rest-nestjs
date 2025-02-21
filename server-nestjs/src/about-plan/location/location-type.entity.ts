import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LocationTypeMappingEntity } from './location-type-mapping.entity';

@Entity('location_type')
export class LocationTypeEntity {
  @PrimaryGeneratedColumn()
  typeId: number;

  @Column({ nullable: false })
  type: string;

  @OneToMany(() => LocationTypeMappingEntity, (mapping) => mapping.type)
  locationMappings: LocationTypeMappingEntity[];
}
