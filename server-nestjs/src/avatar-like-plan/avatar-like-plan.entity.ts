import { PlanEntity } from 'src/about-plan/plan/plan.entity';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { CommonEntity } from 'src/common/entity/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('avatarlikeplan')
export class AvatarLikePlanEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  likeId: number;

  @Column()
  avatarId: number;

  @Column()
  planId: number;

  @ManyToOne(() => AvatarEntity, (avatar) => avatar.likePlans, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'avatarId' })
  avatar: AvatarEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'planId' })
  plan: PlanEntity;
}
