import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ArticleEntity } from '../article/article.entity';
import { ArticleCommentEntity } from './article-comment.entity';
import { CreateArticleCommentDto } from './dtos/article-comment.create.dto';
import { UpdateArticleCommentDto } from './dtos/article-comment.update.dto';

@Injectable()
export class ArticleCommentRepository {
  constructor(
    @InjectRepository(ArticleCommentEntity)
    private readonly repository: Repository<ArticleCommentEntity>,
  ) {}

  async createArticleComment(
    article: ArticleEntity,
    createArticleCommentDto: CreateArticleCommentDto,
    avatar: AvatarEntity,
  ): Promise<ArticleCommentEntity> {
    const comment = this.repository.create({
      article,
      avatar,
      ...createArticleCommentDto,
    });
    return await this.repository.save(comment);
  }

  async findArticleCommentById(
    aCommentId: number,
  ): Promise<ArticleCommentEntity> {
    return await this.repository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.avatar', 'avatar')
      .leftJoinAndSelect('comment.article', 'article')
      .where('comment.aCommentId = :aCommentId', { aCommentId })
      .andWhere('comment.isDeleted = false')
      .getOne();
  }

  async findAllArticleComments(): Promise<ArticleCommentEntity[]> {
    return await this.repository
      .createQueryBuilder('comment')
      .where('comment.isDeleted: false')
      .getMany();
  }

  async updateArticleCommentById(
    commentId: number,
    updateArticleCommentDto: UpdateArticleCommentDto,
  ): Promise<UpdateResult> {
    return await this.repository.update(commentId, {
      ...updateArticleCommentDto,
    });
  }

  async deleteArticleComment(commentId: number): Promise<DeleteResult> {
    return await this.repository.delete(commentId);
  }
}
