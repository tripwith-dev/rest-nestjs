import { Injectable } from '@nestjs/common';
import { AvatarService } from 'src/about-user/avatar/avatar.service';
import { ArticleService } from '../article/article.service';

@Injectable()
export class ArticleCommentService {
  constructor(
    private readonly avatarService: AvatarService,
    private readonly articleService: ArticleService,
  ) {}

  async createArticleComment(
    avatarId: number,
    articleId: number,
    // 이곳에 createArticleDto를 추가
  ) {
    const avatar = await this.avatarService.findAvatarById(avatarId);
    // const article = await this.articleService.findArticleById(articleId);
    // 위 함수에서 avatar 존재 여부 확인하니까 여기서 안해도 됨.
  }
}
