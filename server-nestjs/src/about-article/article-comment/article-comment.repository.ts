import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleCommentEntity } from './article-comment.entity';

@Injectable()
export class ArticleCommentRepository {
  constructor(
    @InjectRepository(ArticleCommentEntity)
    private readonly repository: Repository<ArticleCommentEntity>,
  ) {}
}
