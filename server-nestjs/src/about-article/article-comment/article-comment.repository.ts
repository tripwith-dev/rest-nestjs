import { UpdateArticleCommentDto } from './dtos/article-comment.update.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { ArticleCommentEntity } from './article-comment.entity';
import { CreateArticleCommentDto } from './dtos/article-comment.create.dto';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';
import { ArticleEntity } from '../article/article.entity';

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
    const comment = await this.repository.create({
      article,
      ...createArticleCommentDto,
      avatar,
    });
    return await this.repository.save(comment);
  }

  async findArticleCommentById(
    commentId: number,
  ): Promise<ArticleCommentEntity> {
    return await this.repository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.avatar', 'avatar')
      .leftJoinAndSelect('comment.article', 'article')
      .where('comment.commentId = :commentId', { commentId })
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
