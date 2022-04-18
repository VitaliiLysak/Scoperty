import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxModalStack } from 'ngx-multi-modal';

import { AbstractPageComponent } from '../../../../shared/components/abstract-page/abstract-page.component';
import {
  ConfirmationDialogComponent,
  ConfirmationDialogModel,
  ConfirmationDialogType
} from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { GOOGLE_ANALYTICS_KEY } from '../../../../app.constants';

const ANCHORS = {
  privacypolicyBlock: 'privacypolicy'
};

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.css']
})

export class PrivacyPolicyComponent extends AbstractPageComponent {
  protected _url: string  = '/privacy';
  protected _anchorAliases: Map<string, string> = new Map(Object.entries(ANCHORS));

  public _name: string = 'privacy';

  constructor(
    protected actRoute: ActivatedRoute,
    protected router: Router,
    private modalService: NgxModalStack,
  ) {
    super(actRoute, router);
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
