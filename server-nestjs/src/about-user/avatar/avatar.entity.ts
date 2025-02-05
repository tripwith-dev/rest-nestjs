import { CategoryEntity } from 'src/about-plan/category/category.entity';
import { CommonEntity } from 'src/common/entity/common.entity';
import { UserLikePlanEntity } from 'src/user-like-plan/user-like-plan.entity';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../user/user.entity';

@Entity('avatar')
export class AvatarEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  avatarId: number;

  @Column({ nullable: false, unique: true, length: 20 })
  nickname: string;

  @Column({ nullable: true })
  introduce: string;

  @Column({ nullable: true })
  profileImage: string;

  @OneToOne(() => UserEntity, (user) => user.avatar)
  user: UserEntity;

  @OneToMany(() => CategoryEntity, (category) => category.avatar)
  categories: CategoryEntity[];

  @OneToMany(() => UserLikePlanEntity, (like) => like.user)
  likePlans: UserLikePlanEntity[];
}
