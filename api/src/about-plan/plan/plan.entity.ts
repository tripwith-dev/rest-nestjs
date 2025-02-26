import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { AvatarLikePlanEntity } from 'src/avatar-like-plan/avatar-like-plan.entity';
import { CommonEntity } from 'src/common/entity/common.entity';
import { Status } from 'src/common/enum/status';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from '../category/category.entity';
import { PlanDetailEntity } from '../plan-detail/plan-detail.entity';
import { PlanTagMappingEntity } from '../plan-tag-mapping/plan-tag-mapping.entity';

@Entity('plan')
export class PlanEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  planId: number;

  @Column({ length: 30 })
  planTitle: string;

  @Column({ default: 'uploads/planImages/default.png' })
  planMainImage: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: Status.PRIVATE, // 기본값 설정
  })
  status: Status;

  @Column()
  travelStartDate: string;

  @Column()
  travelEndDate: string;

  @Column({ type: 'int', default: 0 })
  likesCount: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalPrice: number;

  @ManyToOne(() => CategoryEntity, (category) => category.plans)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @ManyToOne(() => AvatarEntity, (avatar) => avatar.plans)
  @JoinColumn({ name: 'avatarId' })
  avatar: AvatarEntity;

  @OneToMany(() => PlanDetailEntity, (detail) => detail.plan)
  details: PlanDetailEntity[];

  @OneToMany(() => PlanTagMappingEntity, (tagMapping) => tagMapping.plan)
  tagMappings: PlanTagMappingEntity[];

  @OneToMany(() => AvatarLikePlanEntity, (like) => like.plan)
  likes: AvatarLikePlanEntity[];
}
