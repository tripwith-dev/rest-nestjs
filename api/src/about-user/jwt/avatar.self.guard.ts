/**
 * 파라미터(or쿼리)의 avatarId와 req.user.avatar.avatarId를 비교하여 일치하는 지 확인.
 * 일치 해야만 API 요청 가능
 */

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class IsAvatarSelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const avatar = request.user.avatar;
    const avatarId = parseInt(
      request.params.avatarId || request.query.avatarId,
      10,
    );

    if (!avatar) {
      throw new BadRequestException('인증되지 않은 요청입니다.');
    }

    if (avatar.avatarId !== avatarId) {
      throw new BadRequestException('다른 사용자의 정보를 조회할 수 없습니다.');
    }

    return true;
  }
}
