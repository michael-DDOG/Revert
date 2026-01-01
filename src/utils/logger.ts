// Production-safe Logger
// Only logs in development mode

const isDev = __DEV__;

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enabledInProduction: boolean;
  prefix: string;
}

const defaultConfig: LoggerConfig = {
  enabledInProduction: false,
  prefix: '[Revert]',
};

class Logger {
  private config: LoggerConfig;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  private shouldLog(): boolean {
    return isDev || this.config.enabledInProduction;
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    return `${this.config.prefix} [${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog()) {
      console.log(this.formatMessage('debug', message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog()) {
      console.log(this.formatMessage('info', message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog()) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    // Always log errors, but format differently for production
    if (isDev) {
      console.error(this.formatMessage('error', message), ...args);
    } else {
      // In production, we could send to error tracking service
      // For now, just log errors silently
      console.error(this.formatMessage('error', message), ...args);
    }
  }

  // Group logs for better organization
  group(label: string): void {
    if (this.shouldLog() && console.group) {
      console.group(`${this.config.prefix} ${label}`);
    }
  }

  groupEnd(): void {
    if (this.shouldLog() && console.groupEnd) {
      console.groupEnd();
    }
  }

  // Time measurements
  time(label: string): void {
    if (this.shouldLog() && console.time) {
      console.time(`${this.config.prefix} ${label}`);
    }
  }

  timeEnd(label: string): void {
    if (this.shouldLog() && console.timeEnd) {
      console.timeEnd(`${this.config.prefix} ${label}`);
    }
  }
}

// Create default logger instance
export const logger = new Logger();

// Export for custom logger creation
export { Logger };

// Quick access functions
export const logDebug = (message: string, ...args: any[]) => logger.debug(message, ...args);
export const logInfo = (message: string, ...args: any[]) => logger.info(message, ...args);
export const logWarn = (message: string, ...args: any[]) => logger.warn(message, ...args);
export const logError = (message: string, ...args: any[]) => logger.error(message, ...args);
