import { IsNotEmpty, IsString } from 'class-validator';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { CommonEntity } from 'src/common/entity/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PlanEntity } from '../plan/plan.entity';

@Entity('plan_comment')
export class PlanCommentEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  pCommentId: number;

  @Column({ length: 300 })
  @IsNotEmpty()
  @IsString()
  pCommentContent: string;

  @ManyToOne(() => AvatarEntity, (avatar) => avatar.planComments)
  @JoinColumn({ name: 'avatarId' })
  avatar: AvatarEntity;

  @ManyToOne(() => PlanEntity, (plan) => plan.planComments)
  @JoinColumn({ name: 'planId' })
  plan: PlanEntity;
}
