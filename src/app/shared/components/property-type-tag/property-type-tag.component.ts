import {
  Component,
  Input,
} from '@angular/core';

import { ExtendedMarkerModel } from '../../../core/models/extended-marker.model';

@Component({
  selector: 'app-property-type-tag',
  templateUrl: './property-type-tag.component.html',
  styleUrls: [
    './property-type-tag.component.css',
  ],
})
export class PropertyTypeTagComponent {
  @Input() marker: ExtendedMarkerModel;

  public get propertyType(): string {
    if (this.marker.isPropertyOfTypeEFH) {
      return 'Haus';
    } else if (this.marker.isPropertyOfTypeMFH) {
      return 'Mehrfamilienhaus';
    } else {
      return 'Wohnung';
    }
  }
}
