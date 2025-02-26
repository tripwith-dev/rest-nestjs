import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PlanTagMappingEntity } from '../plan-tag-mapping/plan-tag-mapping.entity';

@Entity('plan_tag')
export class PlanTagEntity {
  @PrimaryGeneratedColumn()
  pTagId: number;

  @Column()
  pTagName: string;

  @OneToMany(() => PlanTagMappingEntity, (tagMapping) => tagMapping.planTag)
  pTagMappings: PlanTagMappingEntity[];
}
