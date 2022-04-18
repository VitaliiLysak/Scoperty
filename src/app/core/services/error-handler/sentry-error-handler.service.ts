import {
  ErrorHandler,
  Injectable,
} from '@angular/core';

import * as Sentry from '@sentry/browser';

import { environment } from '../../../../environments/environment';

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {
    this.initSentry();
  }

  public handleError(error: any): void {
    Sentry.captureException(error.originalError || error);
    throw error;
  }

  private initSentry(): void {
    const { sentryUrl, sentryEnvironment } = environment;

    Sentry.init({
      dsn: sentryUrl,
      environment: sentryEnvironment,
      release: environment.version,
    });
  }
}
