import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArticleEntity } from './article.entity';

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly repository: Repository<ArticleEntity>,
  ) {}
}
