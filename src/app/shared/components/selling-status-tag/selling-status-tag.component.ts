import {
  Component,
  Input,
  ChangeDetectionStrategy,
} from '@angular/core';

import { templateStatusToFrontend } from '../../utils/deserializator.util';

@Component({
  selector: 'app-selling-status-tag',
  templateUrl: './selling-status-tag.component.html',
  styleUrls: [
    './selling-status-tag.component.css',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellingStatusTagComponent {
  @Input() sellingStatus: string;
  @Input() type: 'small' | 'regular' = 'regular';

  public _name = 'selling-status-tag';

  public get statusText(): string {
    return templateStatusToFrontend(this.sellingStatus);
  }
}
