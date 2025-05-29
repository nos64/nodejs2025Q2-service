import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  dotenv.config();
  const PORT = Number(process.env.PORT) || 4000;
  await app.listen(PORT);
}
bootstrap();
