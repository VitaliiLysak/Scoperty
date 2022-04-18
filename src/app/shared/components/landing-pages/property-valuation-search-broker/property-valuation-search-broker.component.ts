import { Component } from '@angular/core';

import {
  NgxActiveModal,
  NgxModalStack,
} from 'ngx-multi-modal';

import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogResult,
  ConfirmationDialogType,
} from '../../confirmation-dialog/confirmation-dialog.component';
import { IFullFormRequest } from '../../../../core/models/form-request.model';
import { AnalyticsService } from '../../../../core/services/analytics/analytics.service';
import { PropertiesRepositoryService } from '../../../../core/services/properties-repository.service';
import { IRealtorLeadTicket } from '../../../../features/search-broker/pages/search-broker/search-broker.component';

@Component({
  selector: 'app-property-valuation-search-broker',
  templateUrl: './property-valuation-search-broker.component.html',
  styleUrls: [
    './property-valuation-search-broker.component.css',
  ],
})
export class PropertyValuationSearchBrokerComponent {
  showErrorMessage: boolean = false;

  constructor(
    private activeModal: NgxActiveModal,
    private modalService: NgxModalStack,
    private analyticsService: AnalyticsService,
    private propertiesRepositoryService: PropertiesRepositoryService,
  ) {}

  async handleUserData(userData: IFullFormRequest): Promise<void> {
    const realtorLeadTicket: IRealtorLeadTicket = {
      salutation: userData.gender,
      givenName: userData.firstName,
      familyName: userData.secondName,
      email: userData.email,
      phone: userData.phone,
    };

    try {
      this.showErrorMessage = false;
      await this.propertiesRepositoryService.createRealtorLeadTicket(realtorLeadTicket);

      this.analyticsService.triggerFormSubmissionSuccess('searchBrokerForm', 'property-valuation-page');

      this.activeModal.close();
      this.showBecomePartnerSuccessModal();
    } catch (error) {
      this.showErrorMessage = true;
    }
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }

  private showBecomePartnerSuccessModal(): void {
    const dialogModel: ConfirmationDialogModel = {
      type: ConfirmationDialogType.Custom,
      icon: 'check',
      iconSize: '32px',
      title: 'Wir haben deine Anfrage erhalten!',
      message: 'In Kürze wird sich ein Makler bei dir telefonisch melden.',
      buttonLabel: 'Verstanden',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
    modalRef.result.then(result => {
      if (result === ConfirmationDialogResult.Button) {
        this.activeModal.close();
      }
    }, () => {});
  }
}
