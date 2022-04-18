import { LoggerService } from './logger.service';

export class NoopLoggerService implements LoggerService {
  info(message?: any, ...optionalParams: any[]): void {}
  warn(message?: any, ...optionalParams: any[]): void {}
  error(message?: any, ...optionalParams: any[]): void {}
}
