import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { CreateArticleDto } from './dtos/article.create.dto';
import { UpdateArticleDto } from './dtos/article.update.dto';

@Injectable()
export class ArticleRepository {
  constructor(
    @InjectRepository(ArticleEntity)
    private readonly repository: Repository<ArticleEntity>,
  ) {}

  async createArticle(
    createArticleDto: CreateArticleDto,
    avatar: AvatarEntity,
  ): Promise<ArticleEntity> {
    const article = this.repository.create({
      ...createArticleDto,
      avatar,
    });
    return await this.repository.save(article);
  }

  async findArticleById(articleId: number): Promise<ArticleEntity> {
    return await this.repository
      .createQueryBuilder('article')
      .leftJoinAndSelect('article.avatar', 'avatar')
      .where('article.articleId = :articleId', { articleId })
      .andWhere('article.isDeleted = false')
      .getOne();
  }

  async findAllArticles(): Promise<ArticleEntity[]> {
    return await this.repository
      .createQueryBuilder('article')
      .where('article.isDeleted: false')
      .getMany();
  }

  async updateArticle(
    articleId: number,
    updateArticleDto: UpdateArticleDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(articleId, {
      ...updateArticleDto,
    });
  }

  async deleteArticle(articleId: number): Promise<DeleteResult> {
    return await this.repository.delete(articleId);
  }
}
