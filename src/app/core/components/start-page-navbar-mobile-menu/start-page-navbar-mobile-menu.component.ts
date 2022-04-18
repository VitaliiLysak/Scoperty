import {
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

import {
  NAV_ITEMS,
  NavItem,
} from '../../../features/start-page/models/nav-item.model';
import { ScopertyPlusAdService } from '../../services/scoperty-plus-ad.service';

@Component({
  selector: 'app-start-page-navbar-mobile-menu',
  templateUrl: './start-page-navbar-mobile-menu.component.html',
  styleUrls: [
    './start-page-navbar-mobile-menu.component.css',
  ],
})
export class StartPageNavbarMobileMenuComponent {
  @Output()
  close: EventEmitter<void> = new EventEmitter<void>();

  public _name = 'start-page-navbar-mobile-menu';

  public navItems: NavItem[] = NAV_ITEMS;

  constructor(
    private scopertyPlusAdService: ScopertyPlusAdService
  ) {}

  public getLinkColor(isActive: boolean): string {
    return isActive ? 'green' : 'dark';
  }

  public onClose(): void {
    this.close.emit();
  }

  openScopertyPlusLanding() {
    this.scopertyPlusAdService.openScopertyOnBoard();
  }
}
