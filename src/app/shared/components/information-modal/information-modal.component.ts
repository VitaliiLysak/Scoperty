import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { NgxActiveModal } from 'ngx-multi-modal';

import { isSmallMobileDevice } from '../../utils/responsive.util';
import { StateManagerService } from '../../../core/services/state-manager.service';
import { MapFilterService } from '../../../core/services/map-filter.service';
import { isEmptyString } from '../../../shared/utils/empty-string.util';
import { SHARED_ROUTES_NAMES } from '../../../app.constants';

export interface InformationModel {
  text:         string;
  attention?:   string;
  buttonText:   string;
  buttonText2:  string;
  page:         string;
}

type ButtonColor = 'primary-red' | 'secondary-green';

@Component({
  selector: 'app-information-modal',
  templateUrl: './information-modal.component.html',
  styleUrls: ['./information-modal.component.css']
})
export class InformationModalComponent implements InformationModel {

  @Input() title: string;
  @Input() text: string;
  @Input() attention: string;
  @Input() buttonText: string;
  @Input() buttonText2: string;
  @Input() page: string;

  public _name: string = 'information-modal';
  public agreed: boolean = false;
  alignLeft: string = 'left';

  public get buttonDisabled(): boolean {
    return !this.agreed && !isEmptyString(this.attention);
  }

  public get buttonColor(): ButtonColor {
    return !isEmptyString(this.attention) ? 'primary-red' : 'secondary-green';
  }

  constructor(
    private mapFilterService: MapFilterService,
    private router: Router,
    private stateManagerService: StateManagerService,
    private activeModal: NgxActiveModal,
  ) { }

  public changeCheckboxState(checked: boolean): void {
    this.agreed = checked;
  }

  public onLogoClick(): void {
    this.router.navigate(
      [`/${SHARED_ROUTES_NAMES.MAP}`],
      { queryParamsHandling: 'merge' }
    );
    if (isSmallMobileDevice()) {
      setTimeout(() => {
        this.mapFilterService.toggleFiltersShown(false);
      }, 500);
    }
    this.activeModal.close();
  }

  public apply(result: boolean): void {
    if (this.page === 'property-edit') {
      this.stateManagerService.isMapPage = false;
      this.stateManagerService.isStartPage = false;
    }
    this.activeModal.close(result);
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }
}
