import {
  ErrorHandler,
  FactoryProvider,
} from '@angular/core';

import { isEmptyString } from '../../../shared/utils/empty-string.util';
import { environment } from '../../../../environments/environment';

import { SentryErrorHandler } from './sentry-error-handler.service';
import { SentryNoopErrorHandler } from './sentry-noop-error-handler.service';

export const errorHandlerFactory = () => {
  const { sentryUrl, sentryEnvironment } = environment;
  const hasNoSentryUrl = isEmptyString(sentryUrl);
  const hasNoSentryEnvironment = isEmptyString(sentryEnvironment);

  return hasNoSentryUrl || hasNoSentryEnvironment
    ? new SentryNoopErrorHandler()
    : new SentryErrorHandler();
};

export const SentryErrorHandlerProvider: FactoryProvider = {
  provide: ErrorHandler,
  useFactory: errorHandlerFactory,
};
