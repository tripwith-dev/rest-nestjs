import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AvatarService } from 'src/about-user/avatar/avatar.service';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ArticleService } from '../article/article.service';
import { ArticleCommentEntity } from './article-comment.entity';
import { ArticleCommentRepository } from './article-comment.repository';
import { CreateArticleCommentDto } from './dtos/article-comment.create.dto';
import { UpdateArticleCommentDto } from './dtos/article-comment.update.dto';

@Injectable()
export class ArticleCommentService {
  constructor(
    private readonly avatarService: AvatarService,
    private readonly articleService: ArticleService,
    private readonly articleCommentRepository: ArticleCommentRepository,
  ) {}

  async createArticleComment(
    articleId: number,
    createArticleCommentDto: CreateArticleCommentDto,
    avatarId: number,
  ): Promise<ArticleCommentEntity> {
    const avatar = await this.avatarService.findAvatarById(avatarId);
    const article = await this.articleService.findArticleById(articleId);

    if (createArticleCommentDto.aCommentContent.length > 300) {
      throw new UnauthorizedException('댓글은 300자 이하로 작성해 주세요. ');
    }

    return await this.articleCommentRepository.createArticleComment(
      article,
      createArticleCommentDto,
      avatar,
    );
  }

  async findArticleCommentById(
    commentId: number,
  ): Promise<ArticleCommentEntity> {
    const comment =
      await this.articleCommentRepository.findArticleCommentById(commentId);
    if (!comment || !comment.article) {
      throw new NotFoundException('해당하는 댓글에 접근할 수 없습니다 ');
    }
    // 공개 비공개 게시글인지 확인 후 게시글 주인과 로그인한 아바타와 동일한지 비교하고 게시글의 댓글을 확인
    // 근데 이거를 게시글 find함수에서 불러올 수 있나
    return comment;
  }

  async findAllArticleComments(): Promise<ArticleCommentEntity[]> {
    return await this.articleCommentRepository.findAllArticleComments();
  }

  async isOwnerOfComment(commentId: number, avatarId: number) {
    const comment = await this.findArticleCommentById(commentId);
    if (comment.avatar.avatarId !== avatarId) {
      throw new UnauthorizedException('댓글 작성자만 수정할 수 있습니다.');
    }
  }

  async updateArticleCommentById(
    commentId: number,
    updateArticleCommentDto: UpdateArticleCommentDto,
    avatarId: number,
  ): Promise<UpdateResult> {
    await this.isOwnerOfComment(commentId, avatarId);

    if (updateArticleCommentDto.aCommentContent.length > 300) {
      throw new UnauthorizedException('댓글은 300자 이하로 작성해 주세요. ');
    }

    return await this.articleCommentRepository.updateArticleCommentById(
      commentId,
      updateArticleCommentDto,
    );
  }

  async deleteArticleComment(
    commentId: number,
    avatarId: number,
  ): Promise<DeleteResult> {
    await this.isOwnerOfComment(commentId, avatarId);
    return await this.articleCommentRepository.deleteArticleComment(commentId);
  }
}
