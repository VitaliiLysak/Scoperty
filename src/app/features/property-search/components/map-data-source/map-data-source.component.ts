import {
  Component,
  Input,
} from '@angular/core';

import { ZoomLevel } from '../../../../core/models/location.model';

@Component({
  selector: 'app-map-data-source',
  templateUrl: './map-data-source.component.html',
  styleUrls: [
    './map-data-source.component.css',
  ],
})
export class MapDataSourceComponent {
  name: string = 'map-data-source';
}
