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
import { JwtAuthGuard } from 'src/about-user/jwt/jwt.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ArticleEntity } from './article.entity';
import { ArticleService } from './article.service';
import { CreateArticleDto } from './dtos/article.create.dto';
import { UpdateArticleDto } from './dtos/article.update.dto';

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
  async findArticleById(
    @Param('articleId') articleId: number,
  ): Promise<ArticleEntity> {
    return await this.articleService.findArticleById(articleId);
  }

  @Get()
  async findAllArticles(): Promise<ArticleEntity[]> {
    return await this.articleService.findAllArticles();
  }

  @Patch(':articleId/update')
  @UseGuards(JwtAuthGuard)
  async updateArticleByArticleId(
    @Param('articleId') articleId: number,
    @Body() updateArticleDto: UpdateArticleDto,
    @Request() req: any,
  ): Promise<UpdateResult> {
    const avatarId = req.user.avatar.avatarId;
    return await this.articleService.updateArticle(
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
