import { CommonEntity } from 'src/common/entity/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
