import { PlanEntity } from 'src/about-plan/plan/plan.entity';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { UserEntity } from 'src/about-user/user/user.entity';
import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('like')
export class UserLikePlanEntity {
  @PrimaryColumn()
  userId: number;

  @PrimaryColumn()
  planId: number;

  @ManyToOne(() => AvatarEntity, (avatar) => avatar.likePlans, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.likes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'planId' })
  plan: PlanEntity;
}
