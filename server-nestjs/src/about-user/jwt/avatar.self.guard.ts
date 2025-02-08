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
