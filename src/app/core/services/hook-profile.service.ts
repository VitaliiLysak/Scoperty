import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HTTP_Settings } from '../../app.constants';

import { LOGGER } from './logger/logger.provider';
import { LoggerService } from './logger/logger.service';

@Injectable()
export class HookProfileService {
  constructor(
    private httpClient: HttpClient,
    @Inject(LOGGER) private logger: LoggerService,
  ) { }

  public async hookUpdateProfile(): Promise<void> {
    try {
      await this.httpClient.post(`${HTTP_Settings.host}/profile/updated-hook`, {}).toPromise();
    } catch (error) {
      this.logger.error('HookProfileService::hookProfile:Error', error);
    }
  }
}
