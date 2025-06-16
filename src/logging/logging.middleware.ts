import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

import { LoggingService } from './logging.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new LoggingService();

  use(req: Request, res: Response, next: NextFunction) {
    const { body, hostname, method, originalUrl, protocol, query } = req;

    res.on('finish', async () => {
      const { statusCode } = res;

      const date = new Date();

      const log = `Request: ${date.toLocaleString()} ${method} ${protocol}://${hostname}${originalUrl} 
        query: ${JSON.stringify(query)} body: ${JSON.stringify(body)};
        Response: ${statusCode}`;

      if (statusCode >= 400) {
        await this.logger.error(log);
      }

      await this.logger.log(log);
    });

    next();
  }
}
