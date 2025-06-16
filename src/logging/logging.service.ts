import { Injectable, LoggerService, LogLevel } from '@nestjs/common';
import { createReadStream, promises as fs } from 'fs';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { mkdir, access } from 'fs/promises';
import { pipeline } from 'stream/promises';
import { cwd, exit } from 'process';

type LogPriority = { [key in LogLevel]: number };

@Injectable()
export class LoggingService implements LoggerService {
  private readonly logPriority: LogPriority = {
    log: 0,
    error: 1,
    warn: 2,
    debug: 3,
    verbose: 4,
    fatal: 5,
  };

  private logLevel: LogLevel;
  private maxFileSize = parseInt(process.env.MAX_LOG_FILE_SIZE) || 10000;
  private logDirectory = join(cwd(), 'logs');

  constructor() {
    this.logLevel = (process.env.LOG_LEVEL || 'log') as LogLevel;

    this.initLoggerService().catch((err) => {
      console.error('Logger initialization failed:', err);
    });
  }

  private async initLoggerService() {
    try {
      await access(this.logDirectory).catch(async () => {
        await mkdir(this.logDirectory, { recursive: true });
      });

      this.initUncaughtHandlers();

      await this.log(`Logger initialized with level: ${this.logLevel}`);
    } catch (err) {
      console.error('Logger initialization failed:', err);

      throw err;
    }
  }

  private initUncaughtHandlers() {
    process.on('uncaughtException', async (error) => {
      await this.error(`Uncaught Exception: ${error.name}: ${error.message}`);

      exit(1);
    });

    process.on('unhandledRejection', async (reason: Error) => {
      await this.error(`Unhandled Rejection: ${reason.message}`);
    });
  }

  private async logMessage(
    level: LogLevel,
    message: string,
    trace?: string,
    context?: string,
  ) {
    if (
      this.logPriority[level] <
      this.logPriority[(process.env.LOG_LEVEL as LogLevel) || 'log']
    ) {
      return;
    }

    if (this.initLoggerService) {
      try {
        await this.writeToFile(level, message, trace, context);
      } catch (err) {
        console.error('Failed to write log:', err);
      }
    }
  }

  private async writeToFile(
    level: LogLevel,
    message: string,
    trace?: string,
    context?: string,
  ) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp} [${level.toUpperCase()}] ${context ? `[${context}] ` : ''}${message}${trace ? `\n${trace}` : ''}\n`;

    const commonLogPath = join(this.logDirectory, 'app-report.log');
    const errorLogPath = join(this.logDirectory, 'errors-report.log');

    try {
      await this.checkAndRotateLog(commonLogPath);

      await fs.appendFile(commonLogPath, logEntry);

      if (level === 'error' || level === 'warn') {
        await this.checkAndRotateLog(errorLogPath);
        await fs.appendFile(errorLogPath, logEntry);
      }
    } catch (err) {
      console.error('Log write error:', err);
      throw err;
    }
  }

  private async checkAndRotateLog(filePath: string) {
    try {
      const stats = await fs.stat(filePath);

      if (stats.size > this.maxFileSize) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const rotatedPath = filePath.replace('.log', `-${timestamp}.log`);

        await pipeline(
          createReadStream(filePath),
          createWriteStream(rotatedPath),
        );
        await fs.truncate(filePath);
      }
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }

  async log(message: string) {
    console.log('LOG: ', message);

    await this.logMessage('log', `LOG: ${message}`);
  }

  async fatal(message: string) {
    await this.logMessage('fatal', `FATAL: ${message}`);
  }

  async error(message: string) {
    console.error('ERROR: ', message);

    await this.logMessage('error', `ERROR: ${message}`);
  }

  async warn(message: string) {
    console.warn('WARN: ', message);

    await this.logMessage('warn', `WARN: ${message}`);
  }

  async debug(message: string) {
    console.debug('DEBUG: ', message);

    await this.logMessage('debug', `DEBUG: ${message}`);
  }

  async verbose(message: string) {
    console.info('VERBOSE: ', message);

    await this.logMessage('verbose', `VERBOSE: ${message}`);
  }
}
