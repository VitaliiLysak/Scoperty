import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { Router } from '@angular/router';

import { fromEvent, Subscription, } from 'rxjs';
import { filter, map, } from 'rxjs/operators';

import { StartPageNavbarLoginComponent } from '../start-page-navbar-login/start-page-navbar-login.component';
import { PRIVATE_URLS, SHARED_ROUTES_NAMES, } from '../../../app.constants';
import { WINDOW } from '../../services/window.provider';
import { AuthService } from '../../services/auth.service';
import { ShowSignupModalService } from '../../services/show-signup-modal.service';
import { UserService } from '../../services/user.service';
import { NAV_ITEMS, NavItem, } from '../../../features/start-page/models/nav-item.model';
import { isMobileDevice, isMobileDevice$ } from '../../../shared/utils/responsive.util';

export type NavbarTheme = 'light' | 'dark';

const NAVBAR_DARK_THEME_OFFSET_Y = 10;

@Component({
  selector: 'app-start-page-navbar',
  templateUrl: './start-page-navbar.component.html',
  styleUrls: [
    './start-page-navbar.component.css',
  ],
})
export class StartPageNavbarComponent implements OnInit, OnDestroy {
  @Input() scrollContainer: HTMLElement;

  @ViewChild('login') loginComponent: StartPageNavbarLoginComponent;

  name = 'start-page-navbar';

  theme: NavbarTheme = 'light';
  navItems: NavItem[] = NAV_ITEMS;
  isMobileMenuOpened = false;
  isLoginMenuOpened = false;
  isMobileDevice$ = isMobileDevice$;

  linkToMap: string[] = [ `/${ SHARED_ROUTES_NAMES.MAP }` ];

  private scrollSubscription: Subscription;

  get isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

  get iconButtonColor(): string {
    return this.theme === 'light' ? 'white' : 'primary-dark';
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private showSignupModalService: ShowSignupModalService,
    @Inject(DOCUMENT) private document: Document,
    @Inject(WINDOW) private window: Window,
  ) {}

  ngOnInit(): void {
    this.handleScrolling();
  }

  ngOnDestroy(): void {
    this.scrollSubscription.unsubscribe();
  }

  onMobileMenuOpen(): void {
    this.loginComponent.hideMenu();
    this.isMobileMenuOpened = true;
  }

  onMobileMenuClose(): void {
    this.isMobileMenuOpened = false;
  }

  onLoginMenuShow(): void {
    if (!isMobileDevice()) {
      return;
    }

    this.theme = 'dark';
    this.isLoginMenuOpened = true;
  }

  onLoginMenuHide(): void {
    if (!isMobileDevice()) {
      return;
    }

    this.theme = this.getThemeForOffsetY(this.scrollContainer.scrollTop);
    this.isLoginMenuOpened = false;
  }

  openSignupModal(): void {
    this.authService.setFormSubmissionFromNavigation();
    this.showSignupModalService.showSignup();
  }

  logout(): void {
    this.authService.logout();
    this.userService.clearUserInfo();
    this.authService.send('logout');
    if (PRIVATE_URLS.includes((/^(.*)#|\B/i.exec(this.router.url) || [])[1] || this.router.url)) {
      this.router.navigate(this.linkToMap, { queryParamsHandling: 'merge' });
    }
  }

  getLinkColor(isActive: boolean): string {
    if (isActive) {
      return 'green';
    }

    return this.theme === 'light' ? 'white' : 'dark';
  }

  private handleScrolling(): void {
    this.scrollSubscription = fromEvent(this.scrollContainer, 'scroll')
      .pipe(
        filter(() => {
          return !this.isLoginMenuOpened;
        }),
        map((event: any) => {
          return event.target.scrollTop;
        }),
      )
      .subscribe(offsetY => {
        this.theme = this.getThemeForOffsetY(offsetY);
      });
  }

  private getThemeForOffsetY(offsetY: number): NavbarTheme {
    return offsetY >= NAVBAR_DARK_THEME_OFFSET_Y ? 'dark' : 'light';
  }
}
