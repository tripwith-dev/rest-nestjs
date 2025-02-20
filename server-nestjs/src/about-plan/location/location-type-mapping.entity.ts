import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { LocationTypeEntity } from './location-type.entity';
import { LocationEntity } from './location.entity';

@Entity('location_type_mapping')
export class LocationTypeMappingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => LocationEntity, (location) => location.typeMappings, {
    onDelete: 'CASCADE',
  })
  location: LocationEntity;

  @ManyToOne(() => LocationTypeEntity, (type) => type.locationMappings, {
    onDelete: 'CASCADE',
  })
  type: LocationTypeEntity;
}
