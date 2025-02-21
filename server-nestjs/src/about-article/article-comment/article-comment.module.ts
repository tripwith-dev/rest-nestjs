import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarModule } from 'src/about-user/avatar/avatar.module';
import { ArticleModule } from '../article/article.module';
import { ArticleCommentController } from './article-comment.controller';
import { ArticleCommentEntity } from './article-comment.entity';
import { ArticleCommentService } from './article-comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleCommentEntity]),
    ArticleModule,
    AvatarModule,
  ],
  providers: [ArticleCommentService],
  controllers: [ArticleCommentController],
})
export class ArticleCommentModule {}
