import {
  Component, Input,
} from '@angular/core';

import { ScopertyPlusAdService } from '../../services/scoperty-plus-ad.service';

@Component({
  selector: 'app-scoperty-plus-ad',
  templateUrl: './scoperty-plus-ad.component.html',
  styleUrls: ['./scoperty-plus-ad.component.css'],
})
export class ScopertyPlusAdComponent {
  @Input()
  mode: 'white' | 'default' | 'mobile' = 'default';

  @Input()
  smallerTextOnMobile: boolean = false;

  name = 'scoperty-plus-ad';

  constructor(
    public scopertyPlusAdService: ScopertyPlusAdService,
  ) {}
}
