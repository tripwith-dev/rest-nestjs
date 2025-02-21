import { PickType } from '@nestjs/swagger';
import { ArticleEntity } from '../article.entity';

export class CreateArticleDto extends PickType(ArticleEntity, [
  'articleId',
  'articleTitle',
  'articleContent',
]) {}
