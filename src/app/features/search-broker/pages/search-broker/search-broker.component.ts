import { Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { IFullFormRequest } from '../../../../core/models/form-request.model';
import { AbstractPageComponent } from '../../../../shared/components/abstract-page/abstract-page.component';
import { isMobileDevice$ } from '../../../../shared/utils/responsive.util';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { isNullOrUndefined } from '../../../../shared/utils/null-or-undefined.util';

export interface IRealtorLeadTicket {
  salutation: string;
  givenName: string;
  familyName: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-search-broker',
  templateUrl: './search-broker.component.html',
  styleUrls: ['./search-broker.component.css']
})
export class SearchBrokerComponent extends AbstractPageComponent {
  @ViewChild('requestForm') requestFormElement: ElementRef;

  protected _url: string = '/search-broker';

  public _name: string = 'search-broker';
  public showFeedback: boolean = false;
  public isMobileDevice$ = isMobileDevice$;

  constructor(
    protected actRoute: ActivatedRoute,
    protected router: Router,
    private propertiesRepositoryService: PropertiesRepositoryService,
    private analyticsService: AnalyticsService,
  ) {
    super(actRoute, router);
  }

  public async handleUserData(userData: IFullFormRequest): Promise<void> {
    const realtorLeadTicket: IRealtorLeadTicket = {
      salutation: userData.gender,
      givenName: userData.firstName,
      familyName: userData.secondName,
      email: userData.email,
      phone: userData.phone,
    };

    await this.createRealtorLeadTicket(realtorLeadTicket);

    this.analyticsService.triggerFormSubmissionSuccess('searchBrokerForm', 'search-broker-page');

    this.showFeedback = true;
  }

  public async createRealtorLeadTicket(realtorLeadTicket: IRealtorLeadTicket): Promise<void> {
    try {
      await this.propertiesRepositoryService.createRealtorLeadTicket(realtorLeadTicket);
    } catch (error) {}
  }

  public scrollToRequestForm(): void {
    if (!isNullOrUndefined(this.requestFormElement)) {
     this.requestFormElement.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
