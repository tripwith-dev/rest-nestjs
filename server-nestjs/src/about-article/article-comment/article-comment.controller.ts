import { JwtAuthGuard } from 'src/about-user/jwt/jwt.guard';
import { ArticleCommentService } from './article-comment.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateArticleCommentDto } from './dtos/article-comment.create.dto';
import { ArticleCommentEntity } from './article-comment.entity';
import { OptionalAuthGuard } from 'src/about-user/jwt/jwt.optionalAuthGuard';
import { UpdateArticleCommentDto } from './dtos/article-comment.update.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('article-comment')
export class ArticleCommentController {
  constructor(private readonly articleCommentService: ArticleCommentService) {}

  @Post('create/:articleId')
  @UseGuards(JwtAuthGuard)
  async CreateArticleComment(
    @Param('articleId') articleId: number,
    @Body() createArticleCommentDto: CreateArticleCommentDto,
    @Request() req: any,
  ): Promise<ArticleCommentEntity> {
    return await this.articleCommentService.createArticleComment(
      articleId,
      createArticleCommentDto,
      req.user.avatar.avatarId,
    );
  }

  @Get(':commentId')
  @UseGuards(OptionalAuthGuard)
  async findArticleCommentByCommentId(
    @Param('commentId') commentId: number,
    @Request() req?: any,
  ): Promise<ArticleCommentEntity> {
    const avatarId = req?.user?.avatar?.avatarId || null;
    return await this.articleCommentService.findArticleCommentByCommentId(
      commentId,
      avatarId,
    );
  }

  @Get()
  async findAllArticleComments(): Promise<ArticleCommentEntity[]> {
    return await this.articleCommentService.findAllArticleComments();
  }

  @Patch(':commentId/update')
  @UseGuards(JwtAuthGuard)
  async updateArticleCommentByCommentId(
    @Param('commentId') commentId: number,
    @Body() updateArticleCommentDto: UpdateArticleCommentDto,
    @Request() req: any,
  ): Promise<UpdateResult> {
    const avatarId = req.user.avatar.avatarId;
    return await this.articleCommentService.updateArticleCommentByCommentId(
      commentId,
      updateArticleCommentDto,
      avatarId,
    );
  }

  @Delete(':commentId/delete')
  @UseGuards(JwtAuthGuard)
  async deleteArticleComment(
    @Param('commentId') commentId: number,
    @Request() req: any,
  ): Promise<DeleteResult> {
    const avatarId = req.user.avatar.avatarId;
    return await this.articleCommentService.deleteArticleComment(
      commentId,
      avatarId,
    );
  }
}
