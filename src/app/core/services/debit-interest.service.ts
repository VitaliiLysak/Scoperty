import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { DebitInterest } from '../models/debit-interest.model';
import { HTTP_Settings, SKIP_AUTH_HEADER } from '../../app.constants';

import { LOGGER } from './logger/logger.provider';
import { LoggerService } from './logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class DebitInterestService {
  private url: string = HTTP_Settings.host;

  private get skipAuthHeaders(): HttpHeaders {
    return new HttpHeaders().set(SKIP_AUTH_HEADER, 'true');
  }

  constructor(
    private httpClient: HttpClient,
    @Inject(LOGGER) private logger: LoggerService,
  ) {}

  public async getDebitInterest(): Promise<DebitInterest> {
    try {
      return await this.httpClient.get<DebitInterest>(`${this.url}/debit-interest`,
        { headers: this.skipAuthHeaders }).toPromise();
    } catch (error) {
      this.logger.error('DebitInterestService::getDebitInterest', error);
    }
  }
}
