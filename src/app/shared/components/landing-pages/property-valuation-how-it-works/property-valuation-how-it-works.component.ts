import { Component, Input, } from '@angular/core';

import { isMobileDevice } from '../../../utils/responsive.util';

export interface HowItWorksStep {
  icon: string;
  message: string;
}

@Component({
  selector: 'app-property-valuation-how-it-works',
  templateUrl: './property-valuation-how-it-works.component.html',
  styleUrls: [
    './property-valuation-how-it-works.component.css',
  ],
})
export class PropertyValuationHowItWorksComponent {
  @Input() heading: string;
  @Input() steps: HowItWorksStep[] = [];

  name: string = 'property-valuation-how-it-works';

  get iconSize(): string {
    return isMobileDevice() ? '66px' : '82px';
  }
}
