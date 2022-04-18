import { Component, EventEmitter, Input, Output, } from '@angular/core';

import { NavbarTheme } from '../start-page-navbar/start-page-navbar.component';
import { SHARED_ROUTES_NAMES } from '../../../app.constants';
import { isMobileDevice, isMobileDevice$ } from '../../../shared/utils/responsive.util';

@Component({
  selector: 'app-start-page-navbar-login',
  templateUrl: './start-page-navbar-login.component.html',
  styleUrls: [
    './start-page-navbar-login.component.css',
  ],
})
export class StartPageNavbarLoginComponent {
  @Input() theme: NavbarTheme = 'light';
  @Input() isUserLoggedIn: boolean = false;

  @Output() menuShow: EventEmitter<void> = new EventEmitter<void>();
  @Output() menuHide: EventEmitter<void> = new EventEmitter<void>();
  @Output() login: EventEmitter<void> = new EventEmitter<void>();
  @Output() logout: EventEmitter<void> = new EventEmitter<void>();

  name = 'start-page-navbar-login';

  linkToProfile: string[] = [ `/${ SHARED_ROUTES_NAMES.PROFILE }` ];
  linkToMyProperties: string[] = [ `/${ SHARED_ROUTES_NAMES.PROFILE }/${ SHARED_ROUTES_NAMES.PROPERTY }` ];
  isMenuVisible: boolean = false;
  isMobileDevice$ = isMobileDevice$;

  get loginButtonColor(): string {
    if (isMobileDevice()) {
      if (this.isMenuVisible) {
        return 'primary-green';
      }

      return this.theme === 'light' ? 'white' : 'primary-dark';
    }

    return this.theme === 'light' ? 'secondary-white' : 'secondary-green';
  }

  userLogin(): void {
    this.login.emit();
  }

  userLogout(): void {
    this.hideMenu();
    this.logout.emit();
  }

  hideMenu(): void {
    this.isMenuVisible = false;
    this.menuHide.emit();
  }

  toggleMenuVisibility(): void {
    this.isMenuVisible = !this.isMenuVisible;
    if (this.isMenuVisible) {
      this.menuShow.emit();
    } else {
      this.menuHide.emit();
    }
  }

  getLinkColor(isActive: boolean): string {
    return isActive ? 'green' : 'dark';
  }
}
