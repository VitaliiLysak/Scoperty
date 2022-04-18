import { Component, Input } from '@angular/core';

import { isMediumDevice, isMediumDevice$ } from '../../../../shared/utils/responsive.util';

@Component({
  selector: 'app-start-page-owner-benefits-item',
  templateUrl: './start-page-owner-benefits-item.component.html',
  styleUrls: ['./start-page-owner-benefits-item.component.css']
})
export class StartPageOwnerBenefitsItemComponent {
  @Input() ownerText: string;
  @Input() buyerText: string;
  @Input() icon: [string, string]; // Note: First icon is for desktop, second icon is for mobile layout
  @Input() isFirstColumn: boolean = false;

  public _name: string = 'start-page-owner-benefits-item';

  public isMediumDevice$ = isMediumDevice$;

  public get iconForLayout(): string {
    const [ desktopIcon, mobileIcon ] = this.icon;
    return isMediumDevice() ? mobileIcon : desktopIcon;
  }
}
