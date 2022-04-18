import { Inject, Injectable } from '@angular/core';

import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { HTTP_Settings } from '../../app.constants';
import { ContactOwnerData } from '../models/contact-owner.model';

import { LOGGER } from './logger/logger.provider';
import { LoggerService } from './logger/logger.service';

@Injectable({
  providedIn: 'root',
})
export class CustomerRelationshipManagementService {
  constructor(
    private httpClient: HttpClient,
    @Inject(LOGGER) private logger: LoggerService,
  ) { }

  public async contactOwner(contactOwnerData: ContactOwnerData): Promise<void> {
    try {
      await this.httpClient.post(`${HTTP_Settings.host}/crm/tickets/contact_owner`, contactOwnerData).toPromise();
    } catch (error) {
      this.logger.error('ContactOwnerService::contactOwner:Error', error);
    }
  }
}
