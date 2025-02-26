/**
 * 파라미터(or쿼리)의 userId와 req.user.id를 비교하여 일치하는 지 확인.
 * 일치 해야만 API 요청 가능
 */

import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class IsUserSelfGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const userId = parseInt(request.params.userId, 10);

    if (!user) {
      throw new BadRequestException('인증되지 않은 요청입니다.');
    }

    if (user.id !== userId) {
      throw new BadRequestException('다른 사용자의 정보를 조회할 수 없습니다.');
    }

    return true;
  }
}
