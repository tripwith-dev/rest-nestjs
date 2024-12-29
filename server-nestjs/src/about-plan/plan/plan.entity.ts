import { CommonEntity } from 'src/common/entity/common.entity';
import { Status } from 'src/common/enum/status';
import { UserLikePlanEntity } from 'src/user-like-plan/user-like-plan.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoryEntity } from '../category/category.entity';
import { PlanDestinationEntity } from '../plan-destination/plan-destination.entity';
import { PlanDetailEntity } from '../plandetail/plandetail.entity';

@Entity('plan')
export class PlanEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  planId: number;

  @Column({ length: 30 })
  planTitle: string;

  @Column({ nullable: true, default: null })
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
  totalExpenses: number;

  @ManyToOne(() => CategoryEntity, (category) => category.plans)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;

  @OneToMany(() => PlanDetailEntity, (detail) => detail.plan)
  details: PlanDetailEntity[];

  @OneToMany(() => PlanDestinationEntity, (destination) => destination.plan)
  destinations: PlanDestinationEntity[];

  @OneToMany(() => UserLikePlanEntity, (like) => like.plan)
  likes: UserLikePlanEntity[];
}
