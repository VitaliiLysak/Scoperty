import { ErrorHandler } from '@angular/core';

export class SentryNoopErrorHandler implements ErrorHandler {
  public handleError(error: any): void {
    throw error;
  }
}
