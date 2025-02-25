import { PickType } from '@nestjs/swagger';
import { ArticleEntity } from '../article.entity';

export class UpdateArticleDto extends PickType(ArticleEntity, [
  'articleTitle',
  'articleContent',
]) {}
