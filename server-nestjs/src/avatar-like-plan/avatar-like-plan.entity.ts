import { PlanEntity } from 'src/about-plan/plan/plan.entity';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { CommonEntity } from 'src/common/entity/common.entity';
import {
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('like')
export class AvatarLikePlanEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  likeId: number;

  @PrimaryColumn()
  avatarId: number;

  @PrimaryColumn()
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
