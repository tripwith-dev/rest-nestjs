import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LocationTypeEntity } from './location-type.entity';
import { LocationEntity } from './location.entity';

@Entity('location_type_mapping')
export class LocationTypeMappingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LocationEntity, (location) => location.typeMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'locationId' })
  location: LocationEntity;

  @ManyToOne(() => LocationTypeEntity, (type) => type.locationMappings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'locationTypeId' })
  type: LocationTypeEntity;
}
