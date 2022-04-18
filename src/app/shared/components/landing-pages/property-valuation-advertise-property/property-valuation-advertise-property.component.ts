import {
  Component,
  Input,
} from '@angular/core';
import { Router } from '@angular/router';

import { SHARED_ROUTES_NAMES } from '../../../../app.constants';

@Component({
  selector: 'app-property-valuation-advertise-property',
  templateUrl: './property-valuation-advertise-property.component.html',
  styleUrls: [
    './property-valuation-advertise-property.component.css',
  ],
})
export class PropertyValuationAdvertisePropertyComponent {
  @Input() heading: string;

  constructor(private router: Router) {}

  goToMap(): void {
    this.router.navigate([ `/${ SHARED_ROUTES_NAMES.MAP }` ], { queryParamsHandling: 'merge' });
  }
}
