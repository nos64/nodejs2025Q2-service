import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const db = process.env.DATABASE_URL;

@Injectable()
export class PrismaService extends PrismaClient {
  [x: string]: any;
  constructor() {
    super({
      datasources: {
        db: {
          url: db,
        },
      },
    });
  }
}
