import { IsNotEmpty, IsString } from 'class-validator';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { CommonEntity } from 'src/common/entity/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ArticleCommentEntity } from '../article-comment/article-comment.entity';

@Entity('article')
export class ArticleEntity extends CommonEntity {
  @PrimaryGeneratedColumn()
  articleId: number;

  @Column({ length: 30 })
  @IsNotEmpty()
  @IsString()
  articleTitle: string;

  @Column({ length: 500 })
  @IsNotEmpty()
  @IsString()
  articleContent: string;

  @ManyToOne(() => AvatarEntity, (avatar) => avatar.articles)
  @JoinColumn({ name: 'avatarId' })
  avatar: AvatarEntity;

  @OneToMany(
    () => ArticleCommentEntity,
    (articleComment) => articleComment.article,
  )
  articleComments: ArticleCommentEntity[];
}
