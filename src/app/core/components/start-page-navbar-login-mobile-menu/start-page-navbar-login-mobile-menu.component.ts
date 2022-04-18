import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { NavbarTheme } from '../start-page-navbar/start-page-navbar.component';
import { NavItem} from '../../../features/start-page/models/nav-item.model';
import { SHARED_ROUTES_NAMES } from '../../../app.constants';

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Meine Gebote',
    link: `/${ SHARED_ROUTES_NAMES.PROFILE }/${ SHARED_ROUTES_NAMES.OFFERS }`,
  },
  {
    label: 'Meine Immobilien',
    link: `/${ SHARED_ROUTES_NAMES.PROFILE }/${ SHARED_ROUTES_NAMES.PROPERTY }`,
  },
  {
    label: 'Merkliste',
    link: `/${ SHARED_ROUTES_NAMES.PROFILE }/${ SHARED_ROUTES_NAMES.FAVORITES }`,
  },
  {
    label: 'Suchaufträge',
    link: `/${ SHARED_ROUTES_NAMES.PROFILE }/${ SHARED_ROUTES_NAMES.SEARCH }`,
  },
];

@Component({
  selector: 'app-start-page-navbar-login-mobile-menu',
  templateUrl: './start-page-navbar-login-mobile-menu.component.html',
  styleUrls: [
    './start-page-navbar-login-mobile-menu.component.css',
  ],
})
export class StartPageNavbarLoginMobileMenuComponent {
  @Input() theme: NavbarTheme = 'light';

  @Output() logout: EventEmitter<void> = new EventEmitter<void>();

  name = 'start-page-navbar-login-mobile-menu';

  isMyPropertiesOpened: boolean = false;
  linkToProfile: string[] = [ `/${ SHARED_ROUTES_NAMES.PROFILE }` ];
  menuItems: NavItem[] = NAV_ITEMS;

  userLogout(): void {
    this.logout.emit();
  }

  showMyPropertyPages(): void {
    this.isMyPropertiesOpened = true;
  }

  hideMyPropertyPages(): void {
    this.isMyPropertiesOpened = false;
  }

  getLinkColor(isActive: boolean): string {
    return isActive ? 'green' : 'dark';
  }
}
