import { Component } from '@angular/core';

import { isMediumDevice$ } from '../../../../shared/utils/responsive.util';

@Component({
  selector: 'app-start-page-owner-benefits',
  templateUrl: './start-page-owner-benefits.component.html',
  styleUrls: ['./start-page-owner-benefits.component.css']
})
export class StartPageOwnerBenefitsComponent {
  public _name: string = 'start-page-owner-benefits';
  public isMediumDevice$ = isMediumDevice$;
}
