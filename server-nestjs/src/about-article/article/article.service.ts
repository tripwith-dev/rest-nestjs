import { Injectable, NotFoundException } from '@nestjs/common';
import { AvatarService } from 'src/about-user/avatar/avatar.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { ArticleRepository } from './article.repository';
import { CreateArticleDto } from './dtos/article.create.dto';
import { UpdateArticleDto } from './dtos/article.update.dto';

@Injectable()
export class ArticleService {
  constructor(
    private readonly avatarService: AvatarService,
    private readonly articleRepository: ArticleRepository,
  ) {}

  async createArticle(
    createArticleDto: CreateArticleDto,
    avatarId: number,
  ): Promise<ArticleEntity> {
    const avatar = await this.avatarService.findAvatarById(avatarId);
    return await this.articleRepository.createArticle(createArticleDto, avatar);
  }

  async findArticleById(articleId: number): Promise<ArticleEntity> {
    const article = await this.articleRepository.findArticleById(articleId);
    if (!article) {
      throw new NotFoundException('해당하는 게시글을 찾을 수 없습니다.');
    }
    return article;
  }

  async findAllComments(): Promise<ArticleEntity[]> {
    return await this.articleRepository.findAllComments();
  }

  async updateArticle(
    articleId: number,
    updateArticleDto: UpdateArticleDto,
    avatarId: number,
  ): Promise<UpdateResult> {
    const article = await this.findArticleById(articleId);
    const ownerId = article.avatar.avatarId;

    const isOwner = await this.isOwner(ownerId, avatarId);
    if (!isOwner) {
      throw new NotFoundException('게시글 작성자만 수정할 수 있습니다.');
    }

    return await this.articleRepository.updateArticle(
      articleId,
      updateArticleDto,
    );
  }

  async deleteArticle(
    articleId: number,
    avatarId: number,
  ): Promise<DeleteResult> {
    const article = await this.findArticleById(articleId);
    const ownerId = article.avatar.avatarId;

    const isOwner = await this.isOwner(ownerId, avatarId);
    if (!isOwner) {
      throw new NotFoundException('게시글 작성자만 수정할 수 있습니다.');
    }

    return await this.articleRepository.deleteArticle(articleId);
  }

  async isOwner(ownerId: number, avatarId: number) {
    return ownerId === avatarId;
  }
}
