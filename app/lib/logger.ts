/**
 * Environment-aware Logger
 * 
 * Only logs in development environment
 * Prevents sensitive information leakage in production
 */

type LogLevel = 'log' | 'error' | 'warn' | 'info';

class Logger {
  private isDev: boolean;

  constructor() {
    this.isDev = process.env.NODE_ENV === 'development';
  }

  private formatMessage(level: LogLevel, message: string, data?: unknown): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  log(message: string, data?: unknown) {
    if (this.isDev) {
      console.log(this.formatMessage('log', message), data);
    }
  }

  error(message: string, error?: unknown) {
    if (this.isDev) {
      console.error(this.formatMessage('error', message), error);
    }
  }

  warn(message: string, data?: unknown) {
    if (this.isDev) {
      console.warn(this.formatMessage('warn', message), data);
    }
  }

  info(message: string, data?: unknown) {
    if (this.isDev) {
      console.info(this.formatMessage('info', message), data);
    }
  }
}

export const logger = new Logger();
