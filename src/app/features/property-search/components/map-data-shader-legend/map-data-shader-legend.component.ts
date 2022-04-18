import { Component } from '@angular/core';

import { isSmallDevice$ } from '../../../../shared/utils/responsive.util';

@Component({
  selector: 'app-map-data-shader-legend',
  templateUrl: './map-data-shader-legend.component.html',
  styleUrls: [
    './map-data-shader-legend.component.css',
  ],
})
export class MapDataShaderLegendComponent {
  name: string = 'map-data-shader-legend';

  isSmallDevice$ = isSmallDevice$;
}
