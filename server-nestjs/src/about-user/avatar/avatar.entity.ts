import { CategoryEntity } from 'src/about-plan/category/category.entity';
import { CommonEntity } from 'src/common/entity/common.entity';
import { UserLikePlanEntity } from 'src/user-like-plan/user-like-plan.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class UserEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true, length: 20 })
  nickname: string;

  @Column({ nullable: true })
  introduce: string;

  @Column({ nullable: true })
  profileImage: string;

  @OneToMany(() => CategoryEntity, (category) => category.user)
  categories: CategoryEntity[];

  @OneToMany(() => UserLikePlanEntity, (like) => like.user)
  likePlans: UserLikePlanEntity[];
}
