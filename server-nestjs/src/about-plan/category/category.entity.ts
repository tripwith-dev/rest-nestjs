import { IsNotEmpty, IsString } from 'class-validator';
import { UserEntity } from 'src/about-user/user/user.entity';
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

  @ManyToOne(() => UserEntity, (user) => user.categories)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @OneToMany(() => PlanEntity, (plan) => plan.category)
  plans: PlanEntity[];
}
