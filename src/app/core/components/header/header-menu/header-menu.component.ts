import { Component, EventEmitter, Input, Output, } from '@angular/core';

import { isSmallMobileDevice$ } from '../../../../shared/utils/responsive.util';
import { SHARED_ROUTES_NAMES } from '../../../../app.constants';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.css'],
})
export class HeaderMenuComponent {
  @Input() userNotAuthorized;

  @Output() logout: EventEmitter<void> = new EventEmitter<void>();
  @Output() showSignup: EventEmitter<void> = new EventEmitter<void>();
  @Output() showLogin: EventEmitter<void> = new EventEmitter<void>();
  @Output() shouldClose: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() logoClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  public _name: string = 'header-menu';

  public linkToProfile: string = SHARED_ROUTES_NAMES.PROFILE;
  public linkToAbout: string = SHARED_ROUTES_NAMES.ABOUT;
  public linkToPrivacy: string = SHARED_ROUTES_NAMES.PRIVACY;
  public linkToImpressum: string = SHARED_ROUTES_NAMES.IMPRESSUM;
  public linkToHowItWorks: string = SHARED_ROUTES_NAMES.HOWITWORKS;

  isSmallMobileDevice$ = isSmallMobileDevice$;

  public onShowLogin(): void {
    this.showLogin.emit();
    this.close();
  }

  public onShowSignup(): void {
    this.showSignup.emit();
    this.close();
  }

  public onLogout(): void {
    this.logout.emit();
    this.close();
  }

  public onLogoClick(): void {
    this.logoClick.emit();
    this.close();
  }

  public close(): void {
    this.shouldClose.emit(true);
  }
}
