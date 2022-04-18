import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxModalStack } from 'ngx-multi-modal';

import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { AbstractPageComponent } from '../../../../shared/components/abstract-page/abstract-page.component';
import { IFullFormRequest } from '../../../../core/models/form-request.model';
import { isMobileDevice$ } from '../../../../shared/utils/responsive.util';
import {
  CommonErrorComponent,
  CommonErrorDialogModel
} from '../../../../shared/components/common-error/common-error.component';
import { AuthService } from '../../../../core/services/auth.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { ShowSignupModalService } from '../../../../core/services/show-signup-modal.service';


interface IRealtorPartnerTicket {
  salutation: string;
  givenName: string;
  familyName: string;
  email: string;
  phone: string;
}

@Component({
  selector: 'app-professionals',
  templateUrl: './professionals.component.html',
  styleUrls: ['./professionals.component.css']
})

export class ProfessionalsComponent extends AbstractPageComponent {
  protected _url: string = SHARED_ROUTES_NAMES.PROFESSIONALS;

  public _name: string = 'page-professionals';
  public isMobileDevice$ = isMobileDevice$;

  public showFeedback: boolean = false;
  public phoneNumber: string = 'tel:089124794100';

  constructor(
    protected actRoute: ActivatedRoute,
    protected router: Router,
    private showSignupModalService: ShowSignupModalService,
    private modalService: NgxModalStack,
    private authService: AuthService,
    private propertiesRepositoryService: PropertiesRepositoryService,
    private analyticsService: AnalyticsService,
  ) {
    super(actRoute, router);
  }

  public async handleUserData(userData: IFullFormRequest): Promise<void> {
    if (this.authService.isUserLoggedIn()) {
      const dialogModel: CommonErrorDialogModel = {
        title: 'Du bist bereits angemeldet!',
      };
      const modalRef = this.modalService.openFromComponent(CommonErrorComponent);
      Object.assign(modalRef.instance, dialogModel);
      return;
    }

    userData = { ...userData };

    const realtorPartnerTicket: IRealtorPartnerTicket = {
      salutation: userData.gender,
      givenName: userData.firstName,
      familyName: userData.secondName,
      email: userData.email,
      phone: userData.phone,
    };
    await this.createRealtorPartnerTicket(realtorPartnerTicket);
    this.analyticsService.triggerFormSubmissionSuccess('professionalsForm', 'professionals-page');
    this.showFeedback = true;
  }

  public async createRealtorPartnerTicket(realtorPartnerTicket: IRealtorPartnerTicket): Promise<void> {
    await this.propertiesRepositoryService.createRealtorPartnerTicket(realtorPartnerTicket);
  }

  public handleFeedbackButton(): void {
    this.showProfessionalsRegistration();
    this.showFeedback = false;
  }

  public showProfessionalsRegistration(): void {
    this.showSignupModalService.showSignup();
  }

  public goAnchor(block: string): void {
    const element = document.querySelector(`#${block}`);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
