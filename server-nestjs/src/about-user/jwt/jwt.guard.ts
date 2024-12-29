import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// 자동으로 strategy 실행
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
