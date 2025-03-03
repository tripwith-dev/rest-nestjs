import { IsNotEmpty, IsString } from 'class-validator';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { CommonEntity } from 'src/common/entity/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlanEntity } from '../plan/plan.entity';

@Entity('category')
export class CategoryEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column({ length: 20 })
  @IsNotEmpty()
  @IsString()
  categoryTitle: string;

  @ManyToOne(() => AvatarEntity, (avatar) => avatar.categories)
  @JoinColumn({ name: 'avatarId' })
  avatar: AvatarEntity;

  @OneToMany(() => PlanEntity, (plan) => plan.category)
  plans: PlanEntity[];
}
