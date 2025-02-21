import { CreateArticleCommentDto } from './dtos/article-comment.create.dto';
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AvatarService } from 'src/about-user/avatar/avatar.service';
import { ArticleService } from '../article/article.service';
import { ArticleCommentEntity } from './article-comment.entity';
import { ArticleCommentRepository } from './article-comment.repository';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UpdateArticleCommentDto } from './dtos/article-comment.update.dto';
import { ArticleEntity } from '../article/article.entity';

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
    // 이곳에 createArticleDto를 추가
  ): Promise<ArticleCommentEntity> {
    const avatar = await this.avatarService.findAvatarById(avatarId);
    const article = await this.articleService.findArticleByArticleId(
      articleId,
      avatarId,
    );
    // 위 함수에서 avatar 존재 여부 확인하니까 여기서 안해도 됨.
    await this.isPossibleAccessIntoArticleWithComment(articleId, avatarId);
    return await this.articleCommentRepository.createArticleComment(
      article,
      createArticleCommentDto,
      avatar,
    );
  }

  async isPossibleAccessIntoArticleWithComment(
    articleId: number,
    avatarId: number,
  ) {
    const article = await this.articleService.findArticleByArticleId(
      articleId,
      avatarId,
    );
    if (!article) {
      throw new UnauthorizedException('해당하는 게시글을 찾을 수 없습니다.');
    }
    if (article.avatar.avatarId !== avatarId) {
      throw new UnauthorizedException(
        '비공개 게시글에는 댓글을 작성할 수 없습니다.',
      );
    }
  }

  async findArticleCommentByCommentId(
    commentId: number,
    avatarId: number,
  ): Promise<ArticleCommentEntity> {
    const comment =
      await this.articleCommentRepository.findArticleCommentByCommentId(
        commentId,
      );
    if (!comment || !comment.article) {
      throw new NotFoundException('해당하는 게시물에 접근할 수 없습니다 ');
    }
    if (comment.avatar.avatarId !== avatarId) {
      throw new UnauthorizedException('해당 댓글에 접근할 수 없습니다.');
    }
    // 공개 비공개 게시글인지 확인 후 게시글 주인과 로그인한 아바타와 동일한지 비교하고 게시글의 댓글을 확인
    // 근데 이거를 게시글 find함수에서 불러올 수 있나
    return comment;
  }

  async findAllArticleComments(): Promise<ArticleCommentEntity[]> {
    return await this.articleCommentRepository.findAllArticleComments();
  }

  async updateArticleCommentByCommentId(
    commentId: number,
    updateArticleCommentDto: UpdateArticleCommentDto,
    avatarId: number,
  ): Promise<UpdateResult> {
    await this.findArticleCommentByCommentId(commentId, avatarId);
    return await this.articleCommentRepository.updateArticleCommentByCommentId(
      commentId,
      updateArticleCommentDto,
    );
  }

  async deleteArticleComment(
    commentId: number,
    avatarId: number,
  ): Promise<DeleteResult> {
    await this.findArticleCommentByCommentId(commentId, avatarId);
    return await this.articleCommentRepository.deleteArticleComment(commentId);
  }
}
