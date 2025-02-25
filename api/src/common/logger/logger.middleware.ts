import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;

    // 응답이 완료 되었을 때 Logger를 통해서 ip, method, statusCode 정보를 알려줌
    res.on('finish', () => {
      this.logger.log(`${method} ${originalUrl} ${res.statusCode} ${ip}`);
    });

    res.statusCode;

    next();
  }
}
