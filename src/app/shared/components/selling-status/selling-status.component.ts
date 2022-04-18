import {
  Component,
  Input,
} from '@angular/core';

import { templateStatusToFrontend } from '../../utils/deserializator.util';

export type SellingStatusTheme = 'light' | 'dark' | 'green';
export type SellingStatusSize = 'small' | 'large';

@Component({
  selector: 'app-selling-status',
  templateUrl: './selling-status.component.html',
  styleUrls: [
    './selling-status.component.css',
  ],
})
export class SellingStatusComponent {
  @Input() sellingStatus: string;
  @Input() size: SellingStatusSize = 'small';
  @Input() theme: SellingStatusTheme = 'dark';
  @Input() hideLabel: boolean = false;

  public _name = 'selling-status';

  public get statusText(): string {
    return templateStatusToFrontend(this.sellingStatus);
  }
}
