import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/about-user/jwt/jwt.guard';
import { OptionalAuthGuard } from 'src/about-user/jwt/jwt.optionalAuthGuard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ArticleCommentEntity } from './article-comment.entity';
import { ArticleCommentService } from './article-comment.service';
import { CreateArticleCommentDto } from './dtos/article-comment.create.dto';
import { UpdateArticleCommentDto } from './dtos/article-comment.update.dto';

@Controller('article-comment')
export class ArticleCommentController {
  constructor(private readonly articleCommentService: ArticleCommentService) {}

  // article-comment/create?articleId=2
  @Post('create')
  @UseGuards(JwtAuthGuard)
  async CreateArticleComment(
    @Query('articleId') articleId: number,
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
  async findArticleCommentById(
    @Param('commentId') commentId: number,
    @Request() req?: any,
  ): Promise<ArticleCommentEntity> {
    const avatarId = req?.user?.avatar?.avatarId || null;
    return await this.articleCommentService.findArticleCommentById(commentId);
  }

  @Get()
  async findAllArticleComments(): Promise<ArticleCommentEntity[]> {
    return await this.articleCommentService.findAllArticleComments();
  }

  @Patch(':commentId/update')
  @UseGuards(JwtAuthGuard)
  async updateArticleCommentById(
    @Param('commentId') commentId: number,
    @Body() updateArticleCommentDto: UpdateArticleCommentDto,
    @Request() req: any,
  ): Promise<UpdateResult> {
    const avatarId = req.user.avatar.avatarId;
    return await this.articleCommentService.updateArticleCommentById(
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
