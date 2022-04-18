import { Component } from '@angular/core';

import { DialogService } from 'ng2-bootstrap-modal';
import { NgxModalStack } from 'ngx-multi-modal';

import { OpenModalService } from '../../../../core/services/open-modal.service';
import { AuthService, ConfigureType } from '../../../../core/services/auth.service';
import { RegistrationComponent } from '../../../registration/pages/registration/registration.component';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogType
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { GOOGLE_ANALYTICS_KEY, MailToLinks, SHARED_ROUTES_NAMES, TelLinks } from '../../../../app.constants';

@Component({
  selector: 'app-data-protection',
  templateUrl: './data-protection.component.html',
  styleUrls: ['./data-protection.component.css']
})

export class DataProtectionComponent {
  public _name: string = 'data-protection';

  public dataProtectionMailToLink: string = MailToLinks.DataProtection;
  public contactMailToLink: string = MailToLinks.Contact;

  public contactTelLink: string = TelLinks.Contact;

  public linkToHowItWorks: string[] = [ `/${ SHARED_ROUTES_NAMES.HOWITWORKS }` ];

  constructor(
    private openModalService: OpenModalService,
    private dialogService: DialogService,
    private modalService: NgxModalStack,
    private authService: AuthService,
  ) {}


  public openContradictionPossibility(): void {
    this.authService.initConfigure(ConfigureType.Dissent);
    this.openModalService.open();
    this.dialogService.addDialog(
      RegistrationComponent,
      { mode: 'delete' },
    )
      .subscribe((message) => {
        this.authService.initConfigure();
        this.openModalService.close();
      });
  }

  public disableGoogleAnalytics(): void {
    const gaProperty = GOOGLE_ANALYTICS_KEY;
    const disableStr = 'ga-disable-' + gaProperty;
    if (document.cookie.indexOf(disableStr + '=true') <= -1) {
      document.cookie = disableStr + '=true; expires=Thu, 31 Dec 2099 23:59:59 UTC; path=/';
    }
    window[disableStr] = true;
    const dialogModel: ConfirmationDialogModel = {
      message: 'Google Analytics ist jetzt deaktiviert',
      type: ConfirmationDialogType.Info,
      buttonLabel: 'OK',
    };
    const modalRef = this.modalService.openFromComponent(ConfirmationDialogComponent);
    Object.assign(modalRef.instance, dialogModel);
  }
}
