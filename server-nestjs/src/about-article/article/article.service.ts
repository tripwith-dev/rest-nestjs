import { ArticleRepository } from './article.repository';
import { CreateArticleDto } from './dtos/article.create.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AvatarService } from 'src/about-user/avatar/avatar.service';
import { ArticleEntity } from './article.entity';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateArticleDto } from './dtos/article.update.dto';
import { AvatarEntity } from 'src/about-user/avatar/avatar.entity';

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

  async findArticleByArticleId(
    articleId: number,
    avatarId: number,
  ): Promise<ArticleEntity> {
    const article =
      await this.articleRepository.findArticleByArticleId(articleId);
    if (!article) {
      throw new NotFoundException('해당하는 게시글을 찾을 수 없습니다.');
    }
    // 게시글이 공개인지 비공개인지 확인 후 게시글의 주인과 로그인한 아바타와 동일한지 비교
    return await this.articleRepository.findArticleByArticleId(articleId);
  }

  async findAllComments(): Promise<ArticleEntity[]> {
    return await this.articleRepository.findAllComments();
  }

  async updateArticleByArticleId(
    articleId: number,
    updateArticleDto: UpdateArticleDto,
    avatarId: number,
  ): Promise<UpdateResult> {
    const article = await this.findArticleByArticleId(articleId, avatarId);
    return await this.articleRepository.updateArticleByArticleId(
      articleId,
      updateArticleDto,
    );
  }

  async deleteArticle(
    articleId: number,
    avatarId: number,
  ): Promise<DeleteResult> {
    const article = this.findArticleByArticleId(articleId, avatarId);
    return await this.articleRepository.deleteArticle(articleId);
  }
}
