import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvatarModule } from 'src/about-user/avatar/avatar.module';
import { ArticleModule } from '../article/article.module';
import { ArticleCommentController } from './article-comment.controller';
import { ArticleCommentEntity } from './article-comment.entity';
import { ArticleCommentRepository } from './article-comment.repository';
import { ArticleCommentService } from './article-comment.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ArticleCommentEntity]),
    ArticleModule,
    AvatarModule,
  ],
  controllers: [ArticleCommentController],
  providers: [ArticleCommentService, ArticleCommentRepository],
})
export class ArticleCommentModule {}
