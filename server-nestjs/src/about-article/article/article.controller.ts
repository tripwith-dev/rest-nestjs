import { ArticleService } from './article.service';
import { JwtAuthGuard } from 'src/about-user/jwt/jwt.guard';
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
import { CreateArticleDto } from './dtos/article.create.dto';
import { ArticleEntity } from './article.entity';
import { OptionalAuthGuard } from 'src/about-user/jwt/jwt.optionalAuthGuard';
import { UpdateArticleDto } from './dtos/article.update.dto';
import { DeleteResult, UpdateResult } from 'typeorm';

@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createArticle(
    @Body() createArticleDto: CreateArticleDto,
    @Request() req: any,
  ): Promise<ArticleEntity> {
    return await this.articleService.createArticle(
      createArticleDto,
      req.user.avatar.avatarId,
    );
  }

  @Get(':articleId')
  @UseGuards(OptionalAuthGuard)
  async findArticleByArticleId(
    @Param('articleId') articleId: number,
    @Request() req?: any,
  ): Promise<ArticleEntity> {
    const avatarId = req?.user?.avatar?.avatarId || null;
    return await this.articleService.findArticleByArticleId(
      articleId,
      avatarId,
    );
  }

  @Get()
  async findAllComments(): Promise<ArticleEntity[]> {
    return await this.articleService.findAllComments();
  }

  @Patch(':articleId/update')
  @UseGuards(JwtAuthGuard)
  async updateArticleByArticleId(
    @Param('articleId') articleId: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() req: any,
  ): Promise<UpdateResult> {
    const avatarId = req.user.avatar.avatarId;
    return await this.articleService.updateArticleByArticleId(
      articleId,
      updateArticleDto,
      avatarId,
    );
  }

  @Delete(':articleId/delete')
  @UseGuards(JwtAuthGuard)
  async deleteArticle(
    @Param('articleId') articleId: number,
    @Request() req: any,
  ): Promise<DeleteResult> {
    const avatarId = req.user.avatar.avatarId;
    return await this.articleService.deleteArticle(articleId, avatarId);
  }
}
