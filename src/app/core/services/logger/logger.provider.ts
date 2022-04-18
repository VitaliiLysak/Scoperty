import {
  FactoryProvider,
  InjectionToken,
} from '@angular/core';

import { environment } from '../../../../environments/environment';

import { LoggerService } from './logger.service';
import { NoopLoggerService } from './noop-logger.service';

export const LOGGER = new InjectionToken<LoggerService>('Logger');

export const loggerFactory = () => {
  return environment.logging ? console : new NoopLoggerService();
};

export const LoggerProvider: FactoryProvider = {
  provide: LOGGER,
  useFactory: loggerFactory,
};
