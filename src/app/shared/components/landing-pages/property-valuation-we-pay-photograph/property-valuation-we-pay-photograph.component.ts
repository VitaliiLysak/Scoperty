import {
  Component,
  ElementRef,
} from '@angular/core';

import { DEFAULT_SCROLL_TO_OPTIONS } from '../../../utils/scroll.util';

@Component({
  selector: 'app-property-valuation-we-pay-photograph',
  templateUrl: './property-valuation-we-pay-photograph.component.html',
  styleUrls: [
    './property-valuation-we-pay-photograph.component.css',
  ],
})
export class PropertyValuationWePayPhotographComponent {
  name: string = 'property-valuation-we-pay-photograph';

  constructor(private elementRef: ElementRef) {}

  scrollTo(): void {
    this.elementRef.nativeElement.scrollIntoView(DEFAULT_SCROLL_TO_OPTIONS);
  }
}
