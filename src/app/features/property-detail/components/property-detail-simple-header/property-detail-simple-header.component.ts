import {
  Component,
  Input,
} from '@angular/core';

import { ExtendedMarkerModel } from '../../../../core/models/extended-marker.model';

@Component({
  selector: 'app-property-detail-simple-header',
  templateUrl: './property-detail-simple-header.component.html',
  styleUrls: [
    './property-detail-simple-header.component.css',
  ],
})
export class PropertyDetailSimpleHeaderComponent {
  @Input() marker: ExtendedMarkerModel;

  public name: string = 'property-detail-simple-header';

  public get title(): string {
    return this.marker.hasTitle ? this.marker.Title : this.marker.fullAddress;
  }
}
