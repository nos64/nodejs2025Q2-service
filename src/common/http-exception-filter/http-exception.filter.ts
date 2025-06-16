import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from 'src/logging/logging.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    await this.loggingService.log(
      `Request: ${request.method} ${request.url} ${JSON.stringify(request.body)} Query:${JSON.stringify(request.query)}`,
    );

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal Server Error';

    if (!(exception instanceof HttpException)) {
      await this.loggingService.error(
        `Error ${httpStatus} at ${request.url}: ${JSON.stringify(message)}`,
      );
    }

    response.status(httpStatus).json({
      statusCode: httpStatus,
      timestamp: new Date().toLocaleString(),
      path: request.url,
      message,
    });
  }
}
