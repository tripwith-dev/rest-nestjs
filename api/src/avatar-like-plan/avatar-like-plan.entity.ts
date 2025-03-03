import { PlanEntity } from 'src/about-plan/plan/plan.entity';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('avatar_like_plan')
export class AvatarLikePlanEntity {
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
