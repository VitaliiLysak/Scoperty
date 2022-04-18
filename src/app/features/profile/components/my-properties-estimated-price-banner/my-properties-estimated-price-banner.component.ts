import { Component, EventEmitter, Input, Output, } from '@angular/core';

import { SHARED_ROUTES_NAMES } from '../../../../app.constants';
import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { ExtendedMarkerModelValidatorService } from '../../../../core/services/extended-marker-model-validator.service';
import { isEmptyString } from '../../../../shared/utils/empty-string.util';
import { isMobileDevice$ } from '../../../../shared/utils/responsive.util';

@Component({
  selector: 'app-my-properties-estimated-price-banner',
  templateUrl: './my-properties-estimated-price-banner.component.html',
  styleUrls: [
    './my-properties-estimated-price-banner.component.css',
  ],
})
export class MyPropertiesEstimatedPriceBannerComponent {
  @Input() marker: ExtendedMarkerModel;

  @Output() save: EventEmitter<void> = new EventEmitter<void>();

  public _name: string = 'my-properties-estimated-price-banner';

  public isMobileDevice$ = isMobileDevice$;

  public get numberOfExistingMarkerData(): number {
    return this.markerValidatorService.getNumberOfExistingDataInPercent(this.marker);
  }

  public get linkToPropertyDetails(): string[] {
    if (isEmptyString(this.marker.id)) {
      return null;
    }

    return [ `/${ SHARED_ROUTES_NAMES.PROPERTY_DETAIL }`, this.marker.id ];
  }

  constructor(private markerValidatorService: ExtendedMarkerModelValidatorService) {
  }

  public onSave(): void {
    if (this.marker.propertyEditValid) {
      this.save.emit();
    }
  }
}
