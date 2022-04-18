import { Component, EventEmitter, Input, Output, } from '@angular/core';

import { isMobileDevice } from '../../../utils/responsive.util';

export type EasePropertySellIconPosition = 'left' | 'right';
export interface EasePropertySellIconSize {
  width: string;
  height: string;
}

@Component({
  selector: 'app-property-valuation-teaser',
  templateUrl: './property-valuation-teaser.component.html',
  styleUrls: [
    './property-valuation-teaser.component.css',
  ],
})
export class PropertyValuationTeaserComponent {
  @Input() icon: string;
  @Input() iconSize: EasePropertySellIconSize;
  @Input() iconSizeMobile: EasePropertySellIconSize;
  @Input() iconPosition: EasePropertySellIconPosition = 'left';
  @Input() heading: string;
  @Input() message: string;
  @Input() buttonTitle: string;

  @Output() buttonClick: EventEmitter<void> = new EventEmitter<void>();

  name: string = 'property-valuation-teaser';

  get iconSizeToUse(): EasePropertySellIconSize {
    return isMobileDevice() ? this.iconSizeMobile : this.iconSize;
  }

  clickButton(): void {
    this.buttonClick.emit();
  }
}
