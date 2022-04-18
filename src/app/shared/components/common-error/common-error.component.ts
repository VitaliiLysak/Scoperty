import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { NgxActiveModal } from 'ngx-multi-modal';

import { isSmallMobileDevice } from '../../utils/responsive.util';
import { isEmptyString } from '../../utils/empty-string.util';
import { MapFilterService } from '../../../core/services/map-filter.service';

export interface CommonErrorDialogModel {
  title?: string;
  text?: string;
}

@Component({
  selector: 'app-common-error',
  templateUrl: './common-error.component.html',
  styleUrls: ['./common-error.component.css']
})

export class CommonErrorComponent implements CommonErrorDialogModel {
  public _name: string = 'common-error';

  public title: string = '';
  public text: string = '';

  public setInitialText(): void {
    if (isEmptyString(this.title)) {
      this.title = 'Oops!\n' +  'Da ist etwas schief gelaufen!';
    }

    if (isEmptyString(this.text)) {
      this.text = 'Bitte versuche es erneut.';
    }
  }

  constructor(
    public activeModal: NgxActiveModal,
    private mapFilterService: MapFilterService,
    private router: Router,
  ) {
    this.setInitialText();
  }

  public onLogoClick(): void {
    this.router.navigate(['/map'], { queryParamsHandling: 'merge' });
    if (isSmallMobileDevice()) {
      setTimeout(() => {
        this.mapFilterService.toggleFiltersShown(false);
      }, 500);
    }
    this.activeModal.close();
  }

  public apply(): void {
    this.activeModal.close();
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }
}
