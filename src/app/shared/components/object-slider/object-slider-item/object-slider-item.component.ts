import {Component, Input} from '@angular/core';

import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';

@Component({
  selector: 'app-object-slider-item',
  templateUrl: './object-slider-item.component.html',
  styleUrls: ['./object-slider-item.component.css']
})
export class ObjectSliderItemComponent {
  @Input() marker: ExtendedMarkerModel;
  @Input() locationPrefix: string = '';

  name: string = 'object-slider-item';
  linkToPropertyDetail: string = `/${SHARED_ROUTES_NAMES.PROPERTY_DETAIL}`;

  get markerTitle(): string {
    return this.marker.hasTitle ? this.marker.Title : this.marker.fullAddress;
  }

  get markerAddress(): string {
    return this.marker.hasTitle ? this.marker.fullAddress : '';
  }
}
