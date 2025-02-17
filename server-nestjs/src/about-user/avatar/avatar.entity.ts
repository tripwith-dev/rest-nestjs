import { CategoryEntity } from 'src/about-plan/category/category.entity';
import { AvatarLikePlanEntity } from 'src/avatar-like-plan/avatar-like-plan.entity';
import { CommonEntity } from 'src/common/entity/common.entity';
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

  @Column({ default: 'uploads/profileImages/default.png' })
  profileImage: string;

  @OneToOne(() => UserEntity, (user) => user.avatar)
  user: UserEntity;

  @OneToMany(() => CategoryEntity, (category) => category.avatar)
  categories: CategoryEntity[];

  @OneToMany(() => AvatarLikePlanEntity, (like) => like.avatar)
  likePlans: AvatarLikePlanEntity[];
}
