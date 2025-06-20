import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggingService } from './logging/logging.service';
import { HttpExceptionFilter } from './common/http-exception-filter/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useLogger(app.get(LoggingService));
  const logger = new LoggingService();
  app.useGlobalFilters(new HttpExceptionFilter(logger));

  process.on('uncaughtException', async (error) => {
    logger.error(`Uncaught Exception: ${error.name}: ${error.message}`);
  });

  process.on('unhandledRejection', async (reason: Error) => {
    logger.error(`Unhandled Rejection: ${reason.message}`);
  });

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home Library Service')
    .setVersion('1.0')
    .addTag('Home music library service')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  dotenv.config();
  const PORT = Number(process.env.PORT) ?? 4000;
  await app.listen(PORT);
}
bootstrap();
