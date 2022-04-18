import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';
import { NgxModalStack } from 'ngx-multi-modal';

import { widthSmallerThan } from '../../shared/utils/responsive.util';
import { WINDOW } from './window.provider';
import {
  NAVBAR_BREAKPOINT_PX,
  SCOPERTY_PLUS_INVISION_LANDING,
  SCOPERTY_PLUS_ONBOARD_FORM_DATA_LOCAL_STORAGE_KEY
} from '../../app.constants';
// tslint:disable-next-line:max-line-length
import { ScopertyPlusOnboardComponent } from '../../features/scoperty-plus-onboard/components/scoperty-plus-onboard/scoperty-plus-onboard.component';
import { isNullOrUndefined } from '../../shared/utils/null-or-undefined.util';
import { LOCAL_STORAGE } from './local-storage.provider';
import { QueryParamsService } from './query-params.service';

@Injectable()
export class ScopertyPlusAdService {
  private scopertyPlusAdStateBS = new BehaviorSubject<boolean>(false);

  readonly scopertyPlusAdState$ = this.scopertyPlusAdStateBS.asObservable();

  private scopertyPlusOpenedStateBS = new BehaviorSubject<boolean>(false);

  readonly scopertyPlusOnboardingOpenedState$ = this.scopertyPlusOpenedStateBS.asObservable();

  get onboardingNeedsToBeOpened() {
    return this.localStorage.getItem(SCOPERTY_PLUS_ONBOARD_FORM_DATA_LOCAL_STORAGE_KEY);
  }

  get wouldShowDetails(): boolean {
    return !widthSmallerThan(NAVBAR_BREAKPOINT_PX);
  }

  constructor(
    private modalService: NgxModalStack,
    private queryParamsService: QueryParamsService,
    @Inject(WINDOW) private window: Window,
    @Inject(LOCAL_STORAGE) private localStorage: Storage,
  ) {}

  async openScopertyPlusAd(callback?: Function) {
    if (!this.wouldShowDetails) {
      this.openScopertyOnBoard();
    } else {
      if (callback) {
        callback();
      } else {
        this.scopertyPlusAdStateBS.next(true);
      }
    }
  }

  closeScopertyPlusAd() {
    this.scopertyPlusAdStateBS.next(false);
  }

  openScopertyPlusLanding() {
    window.open(SCOPERTY_PLUS_INVISION_LANDING, '_blank');
  }

  async openScopertyOnBoard() {
    this.scopertyPlusOpenedStateBS.next(true);
    setTimeout(() => this.closeScopertyPlusAd());
    const modalRef = this.modalService.openFromComponent(
      ScopertyPlusOnboardComponent,
      {
        windowClass: 'ngx-multi-modal scoperty-plus-onboard',
        beforeDismiss: () => {
          modalRef.componentRef.instance.purgeSavedFormContents();
          const goingToClose = modalRef.componentRef.instance.confirmOnClose
            ? this.window.confirm('Webseite verlassen? Ihre Änderungen werden eventuell nicht gespeichert.')
            : true;
          this.scopertyPlusAdStateBS.next(!goingToClose);

          if (this.queryParamsService.hasOpenScopertyPlusOnboard()) {
            this.queryParamsService.clearOpenScopertyPlusOnboardModal();
          }

          return goingToClose;
        }
      }
    );

    const scopertyPlusOnboardResult: any = await modalRef.result;
    if (isNullOrUndefined(scopertyPlusOnboardResult)) {
      return;
    }
  }
}
