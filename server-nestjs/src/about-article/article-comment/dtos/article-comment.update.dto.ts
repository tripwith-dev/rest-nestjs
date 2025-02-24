import { PickType } from '@nestjs/swagger';
import { ArticleCommentEntity } from '../article-comment.entity';

export class UpdateArticleCommentDto extends PickType(ArticleCommentEntity, [
  'aCommentContent',
]) {}
