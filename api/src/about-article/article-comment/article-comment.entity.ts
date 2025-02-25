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
import { ArticleEntity } from '../article/article.entity';

@Entity('article_comment')
export class ArticleCommentEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  articleCommentId: number;

  @Column({ length: 300 })
  @IsNotEmpty()
  @IsString()
  aCommentContent: string;

  @ManyToOne(() => AvatarEntity, (avatar) => avatar.articleComments)
  @JoinColumn({ name: 'avatarId' })
  avatar: AvatarEntity;

  @ManyToOne(() => ArticleEntity, (article) => article.articleComments)
  @JoinColumn({ name: 'articleId' })
  article: ArticleEntity;
}
