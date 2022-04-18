import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  ViewEncapsulation,
} from '@angular/core';

import { IconButtonComponent } from './icon-button.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'a[app-icon-button]',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon-button.component.html',
  styleUrls: [
    './icon-button.component.css',
  ],
})
export class IconAnchorComponent extends IconButtonComponent {
  @HostListener('click', [ '$event' ])
  haltDisabledEvents(event: Event): void {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }
}
