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
