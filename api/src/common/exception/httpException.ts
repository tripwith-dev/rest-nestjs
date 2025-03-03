import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    // error는 예외 처리시에 응답을 받음 => nest 자체에서는 객체로 예외처리를 일으키므로 따로 타입을 지정
    const error = exception.getResponse() as
      | string
      | { error: string; statusCode: number; message: string | string[] };

    // NestJS의 Logger를 사용하여 에러를 기록
    this.logger.error(error);

    // 분기처리
    if (typeof error === 'string') {
      response.status(status).json({
        success: false,
        // timestamp: new Date().toISOString(),
        path: request.url,
        error,
      });
    } else {
      // nest 자체에서 발생하는 에러
      response.status(status).json({
        success: false,
        // timestamp: new Date().toISOString(),
        ...error,
      });
    }
  }
}
