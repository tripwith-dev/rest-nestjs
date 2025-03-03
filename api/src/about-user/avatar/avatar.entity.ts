import { ArticleCommentEntity } from 'src/about-article/article-comment/article-comment.entity';
import { ArticleEntity } from 'src/about-article/article/article.entity';
import { CategoryEntity } from 'src/about-plan/category/category.entity';
import { PlanCommentEntity } from 'src/about-plan/plan-comment/plan-comment.entity';
import { PlanEntity } from 'src/about-plan/plan/plan.entity';
import { AvatarLikePlanEntity } from 'src/avatar-like-plan/avatar-like-plan.entity';
import { CommonEntity } from 'src/common/entity/common.entity';
import { Currency } from 'src/common/enum/currency';
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

  // softDelete 후 새로 생성할 때 unique: true 설정 시 에러 발생
  // 중복 체크 따로 해줄거임
  @Column({ nullable: false, length: 20 })
  nickname: string;

  @Column({ nullable: true })
  introduce: string;

  @Column({ default: 'uploads/profileImages/default.png' })
  profileImage: string;

  @Column({ default: Currency.KRW })
  currency: Currency;

  @OneToOne(() => UserEntity, (user) => user.avatar)
  user: UserEntity;

  @OneToMany(() => CategoryEntity, (category) => category.avatar)
  categories: CategoryEntity[];

  @OneToMany(() => AvatarLikePlanEntity, (like) => like.avatar)
  likePlans: AvatarLikePlanEntity[];

  @OneToMany(() => PlanEntity, (plan) => plan.avatar)
  plans: PlanEntity[];

  @OneToMany(() => PlanCommentEntity, (planComment) => planComment.avatar)
  planComments: PlanCommentEntity[];

  @OneToMany(() => ArticleEntity, (article) => article.avatar)
  articles: ArticleEntity[];

  @OneToMany(
    () => ArticleCommentEntity,
    (articleComment) => articleComment.avatar,
  )
  articleComments: ArticleCommentEntity[];
}
