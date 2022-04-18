import { Component } from '@angular/core';

import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-property-valuation-market-value-determination',
  templateUrl: './property-valuation-market-value-determination.component.html',
  styleUrls: [
    './property-valuation-market-value-determination.component.css',
  ],
})
export class PropertyValuationMarketValueDeterminationComponent {
  name: string = 'property-valuation-market-value-determination';

  videoSrc: string = `${ environment.assetsUrl }/der_scoperty_wert_final.mp4`;
}
