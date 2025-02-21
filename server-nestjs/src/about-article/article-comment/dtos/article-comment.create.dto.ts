import { PickType } from '@nestjs/swagger';
import { ArticleCommentEntity } from '../article-comment.entity';

export class CreateArticleCommentDto extends PickType(ArticleCommentEntity, [
  'aCommentContent',
]) {}
