import { Injectable } from '@nestjs/common';
import { AvatarService } from 'src/about-user/avatar/avatar.service';

@Injectable()
export class ArticleService {
  constructor(private readonly avatarService: AvatarService) {}

  async createArticle(
    avatarId: number,
    // 이곳에 createArticleDto를 추가
  ) {
    const avatar = await this.avatarService.findAvatarById(avatarId);
    // 위 함수에서 avatar 존재 여부 확인하니까 여기서 안해도 됨.
  }
}
